

import SettingsPage from "@/components/settings/settings-page";
import { RoleGuard } from "@/helper/role-guard";
export default function Settingspage(){

  return(
    <RoleGuard allowed={["Admin"]}>

<SettingsPage/>
    </RoleGuard>
    
  )
}