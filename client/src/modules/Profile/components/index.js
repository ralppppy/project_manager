import { lazy } from "react";

const ProfileHeader = lazy(() => import("./ProfileHeader"));
const PlatformSettings = lazy(() => import("./PlatformSettings"));
const ProfileInformation = lazy(() => import("./ProfileInformation"));
const LanguageAndRegion = lazy(() => import("./LanguageAndRegion"));
const UserProjects = lazy(() => import("./UserProjects"));
const ProfileInformationModal = lazy(() => import("./ProfileInformationModal"));

export {
  ProfileHeader,
  PlatformSettings,
  ProfileInformation,
  LanguageAndRegion,
  UserProjects,
  ProfileInformationModal,
};
