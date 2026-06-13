import { writable } from 'svelte/store';
import { invoke } from '@tauri-apps/api/core';
import type { ButtplugFeatureConfig } from '$lib/types/buttplug';
import { defaultButtplugFeatureConfig } from '$lib/types/buttplug';

/**
 * Writable store for Buttplug feature configuration
 * Controls how many of each feature type to advertise to Buttplug clients
 */
export const buttplugSettings = writable<ButtplugFeatureConfig>(defaultButtplugFeatureConfig);

/**
 * Reset Buttplug settings to defaults
 */
export function resetButtplugSettings() {
  setButtplugSettings(defaultButtplugFeatureConfig);
}


let hasHydrated = false;

export function setButtplugSettings(settings: ButtplugFeatureConfig) {
  hasHydrated = true;
  buttplugSettings.set(settings);
}

export async function saveButtplugSettings(settings: ButtplugFeatureConfig) {
  await invoke('save_buttplug_settings', { settings });
}

buttplugSettings.subscribe((settings) => {
  if (!hasHydrated) return;
  saveButtplugSettings(settings).catch((error) => {
    console.error('[ButtplugSettings] Failed to save settings:', error);
  });
});
