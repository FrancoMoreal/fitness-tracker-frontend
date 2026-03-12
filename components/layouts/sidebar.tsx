import { getSession } from "@/lib/session"
import { getMyMemberProfile } from "@/services/member.service"
import { SidebarClient, NAV_ICONS, type NavItem } from "@/components/layouts/sidebar-client"

export async function Sidebar() {
  const session = await getSession()
  if (!session) return null

  const { userType, sub: username } = session
  const navItems = await buildNavItems(userType)

  return (
    <SidebarClient
      navItems={navItems}
      username={username}
      userType={userType}
    />
  )
}

async function buildNavItems(userType: string): Promise<NavItem[]> {
  if (userType === "TRAINER") return buildTrainerNavItems()
  if (userType === "MEMBER")  return buildMemberNavItems()
  return []
}

function buildTrainerNavItems(): NavItem[] {
  return [
    { label: "Mis miembros",        href: "/trainer/members",   icon: NAV_ICONS.members   },
    { label: "Rutinas",             href: "/trainer/routines",  icon: NAV_ICONS.routines  },
    { label: "Planes alimenticios", href: "/trainer/nutrition", icon: NAV_ICONS.nutrition },
    { label: "Perfil",              href: "/profile",           icon: NAV_ICONS.profile   },
  ]
}

async function buildMemberNavItems(): Promise<NavItem[]> {
  const member = await getMyMemberProfile().catch(() => null)
  const hasTrainer = member?.assignmentStatus === "ACTIVE"

  const items: NavItem[] = []

  if (!hasTrainer) {
    items.push({ label: "Buscar entrenador", href: "/member/trainers", icon: NAV_ICONS.members })
  }

  if (hasTrainer) {
    items.push({ label: "Rutinas",          href: "/member/routines",  icon: NAV_ICONS.routines  })
    items.push({ label: "Plan alimenticio", href: "/member/nutrition", icon: NAV_ICONS.nutrition })
    items.push({ label: "Mi entrenador",    href: "/member/my-trainer", icon: NAV_ICONS.myTrainer })
  }

  items.push({ label: "Perfil", href: "/profile", icon: NAV_ICONS.profile })

  return items

}