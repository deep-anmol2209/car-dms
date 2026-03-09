import UsersManagement from "@/components/users/users-table";
import { RoleGuard } from "@/helper/role-guard";


export default function UsersPage() {
   
  
  
  

    return (
        <RoleGuard  allowed={["Admin"]}>
       <UsersManagement  />
       </RoleGuard>
    );
}