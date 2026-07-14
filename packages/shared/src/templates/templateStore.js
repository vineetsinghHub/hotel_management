// Template store — persists (a) super-admin-created custom templates and
// (b) per-tenant appearance selections (which template + 4 sub-options).
//
// Two persisted maps:
//   customTemplates  : keyed by templateId
//   tenantAppearance : keyed by tenantSlug

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  BUILT_IN_TEMPLATES,
  APPEARANCE_DEFAULTS,
  resolveAppearance,
} from "./templateRegistry";

const EMPTY_MAP = Object.freeze({});

export const useTemplateStore = create(
  persist(
    (set) => ({
      customTemplates: {},
      tenantAppearance: {},
      // Per-tenant à-la-carte unlocks. Keys are "family:optionKey" strings,
      // e.g. "cursor:sparkle", "button:lift". A tenant with an unlock can
      // apply that option regardless of their subscription tier.
      tenantUnlocks: {},

      // Super admin — CRUD for custom templates.
      addTemplate: (tpl) =>
        set((s) => ({
          customTemplates: {
            ...s.customTemplates,
            [tpl.id]: { ...tpl, builtIn: false, createdAt: new Date().toISOString() },
          },
        })),

      updateTemplate: (id, patch) =>
        set((s) => {
          const existing = s.customTemplates[id];
          if (!existing) return s;
          return {
            customTemplates: {
              ...s.customTemplates,
              [id]: { ...existing, ...patch, updatedAt: new Date().toISOString() },
            },
          };
        }),

      publishTemplate: (id, published) =>
        set((s) => {
          const existing = s.customTemplates[id];
          if (!existing) return s;
          return {
            customTemplates: {
              ...s.customTemplates,
              [id]: { ...existing, published, updatedAt: new Date().toISOString() },
            },
          };
        }),

      removeTemplate: (id) =>
        set((s) => {
          const next = { ...s.customTemplates };
          delete next[id];
          return { customTemplates: next };
        }),

      // Per-tenant appearance (template pick + sub-options).
      setTenantAppearance: (slug, patch) =>
        set((s) => ({
          tenantAppearance: {
            ...s.tenantAppearance,
            [slug]: { ...(s.tenantAppearance[slug] || {}), ...patch },
          },
        })),

      resetTenantAppearance: (slug) =>
        set((s) => {
          const next = { ...s.tenantAppearance };
          delete next[slug];
          return { tenantAppearance: next };
        }),

      // Marketplace — record an à-la-carte unlock for a tenant.
      unlockOption: (slug, family, optionKey) =>
        set((s) => {
          const key = `${family}:${optionKey}`;
          const current = s.tenantUnlocks[slug] || [];
          if (current.includes(key)) return s;
          return {
            tenantUnlocks: {
              ...s.tenantUnlocks,
              [slug]: [...current, key],
            },
          };
        }),
    }),
    {
      name: "aura_templates_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ── Selectors / hooks ──────────────────────────────────────────────────────

// Zustand's default equality check is Object.is — selectors returning fresh
// arrays every call trip the "getSnapshot should be cached" infinite loop.
// We subscribe to the raw slice (a stable reference until it's mutated) and
// compose the final list inside the consumer via useMemo.
import { useMemo } from "react";

export const useCustomTemplates = () =>
  useTemplateStore((s) => s.customTemplates);

export const useAllTemplates = () => {
  const custom = useCustomTemplates();
  return useMemo(() => [...BUILT_IN_TEMPLATES, ...Object.values(custom)], [custom]);
};

export const usePublishedTemplates = () => {
  const custom = useCustomTemplates();
  return useMemo(
    () => [...BUILT_IN_TEMPLATES, ...Object.values(custom)].filter((t) => t.published !== false),
    [custom]
  );
};

// Non-reactive read for handlers.
export const getAllTemplates = () => {
  const s = useTemplateStore.getState();
  return [...BUILT_IN_TEMPLATES, ...Object.values(s.customTemplates)];
};

export const getTemplateById = (id) => {
  const all = getAllTemplates();
  return all.find((t) => t.id === id) || BUILT_IN_TEMPLATES[0];
};

// Reactive lookup for a tenant's active template + resolved options.
// Splits subscription across two primitive slices (customTemplates map +
// tenantAppearance[slug]) to avoid the getSnapshot infinite loop, then
// composes the result via useMemo.
export const useTenantAppearance = (slug, tenant) => {
  const customMap = useTemplateStore((s) => s.customTemplates);
  const tenantOverride = useTemplateStore((s) => s.tenantAppearance[slug]);
  return useMemo(() => {
    const override = tenantOverride || EMPTY_MAP;
    const explicitId =
      override.templateId ||
      tenant?.appearance?.templateId ||
      APPEARANCE_DEFAULTS.templateId;
    const all = [...BUILT_IN_TEMPLATES, ...Object.values(customMap)];
    const template =
      all.find((t) => t.id === explicitId) ||
      all.find((t) => t.base === tenant?.template) ||
      BUILT_IN_TEMPLATES[0];
    return resolveAppearance(template, override);
  }, [customMap, tenantOverride, tenant]);
};

export const getTenantAppearance = (slug, tenant) => {
  const s = useTemplateStore.getState();
  const tenantOverride = s.tenantAppearance[slug] || EMPTY_MAP;
  const explicitId =
    tenantOverride.templateId ||
    tenant?.appearance?.templateId ||
    APPEARANCE_DEFAULTS.templateId;
  const all = [...BUILT_IN_TEMPLATES, ...Object.values(s.customTemplates)];
  const template =
    all.find((t) => t.id === explicitId) ||
    all.find((t) => t.base === tenant?.template) ||
    BUILT_IN_TEMPLATES[0];
  return resolveAppearance(template, tenantOverride);
};

// ── Marketplace unlocks ────────────────────────────────────────────────────

const EMPTY_LIST = Object.freeze([]);

export const useTenantUnlocks = (slug) =>
  useTemplateStore((s) => s.tenantUnlocks[slug] || EMPTY_LIST);

export const getTenantUnlocks = (slug) =>
  useTemplateStore.getState().tenantUnlocks[slug] || EMPTY_LIST;

