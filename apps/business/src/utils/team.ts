import { addYears } from "date-fns";
import { cookies } from "next/headers";

export const selectedTeamIdCookieName = "selected-team-id";

export async function getTeamId() {
  const cookieStore = cookies();
  const teamId = cookieStore.get(selectedTeamIdCookieName)?.value;

  return teamId;
}

export async function setTeamId(teamId: string) {
  const cookieStore = cookies();
  cookieStore.set(selectedTeamIdCookieName, teamId, {
    expires: addYears(new Date(), 100),
  });
}

export async function deleteTeamId() {
  const cookieStore = cookies();
  cookieStore.delete(selectedTeamIdCookieName);
}

export const selectedEnvironmentIdCookieName = "selected-environment-id";

export async function getEnvironmentId() {
  const cookieStore = cookies();
  const environmentId = cookieStore.get(selectedEnvironmentIdCookieName)?.value;

  return environmentId;
}

export async function setEnvironmentId(environmentId: string) {
  const cookieStore = cookies();
  cookieStore.set(selectedEnvironmentIdCookieName, environmentId, {
    expires: addYears(new Date(), 100),
  });
}

export async function deleteEnvironmentId() {
  const cookieStore = cookies();
  cookieStore.delete(selectedEnvironmentIdCookieName);
}
