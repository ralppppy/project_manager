import { lazy } from "react";

const SettingsInput = lazy(() => import("./SettingsInput"));
const SettingsCard = lazy(() => import("./SettingsCard"));
const SettingsItem = lazy(() => import("./SettingsItem"));
const SettingsItemContainer = lazy(() => import("./SettingsItemContainer"));
const DropdownSettings = lazy(() => import("./DropdownSettings"));

export { SettingsInput, SettingsCard, SettingsItem, SettingsItemContainer };
