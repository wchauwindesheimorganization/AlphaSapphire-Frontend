import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu"
export default function NavigationKeyUser() {
    return (
        <NavigationMenu >
            <NavigationMenuList>
                <NavigationMenuItem className="font">
                    <NavigationMenuTrigger>Key User</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink
                            className="group inline-flex w-full px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"

                            href="/keyuser/users" >
                            Users</NavigationMenuLink>
                        <NavigationMenuLink
                            className="group inline-flex w-full px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            href="/keyuser/mandates">
                            Mandates</NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    )

}