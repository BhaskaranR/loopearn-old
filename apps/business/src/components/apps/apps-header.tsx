import { SearchField } from "@/components/search-field";
import { AppsTabs } from "./apps-tabs";

export function AppsHeader() {
  return (
    <div className="flex space-x-4">
      <AppsTabs />
      <SearchField placeholder="Search apps" shallow />
    </div>
  );
}
