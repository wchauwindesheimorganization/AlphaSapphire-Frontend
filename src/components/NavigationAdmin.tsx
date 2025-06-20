import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu"
export default function NavigationAdmin() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem className="font">
                    <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
                    <NavigationMenuContent >
                        <NavigationMenuLink
                            className="group inline-flex w-full px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            href="/administrator/users" >Users</NavigationMenuLink>
                        <NavigationMenuLink
                            className="group inline-flex w-full px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            href="/administrator/departments" >Departments</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    )

}