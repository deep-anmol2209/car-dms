import SocialPostingPage from "@/components/social/social-page";
import { RoleGuard } from "@/helper/role-guard";
export default function SocialPage(){

  return(
    <RoleGuard allowed={["Admin"]}>

<SocialPostingPage/>
    </RoleGuard>
    
  )
}