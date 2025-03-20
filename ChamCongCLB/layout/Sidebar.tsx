import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Navigation } from '@toolpad/core/AppProvider'

export const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'part1',
    title: 'Part 1',
    icon: <DashboardIcon />,
  },
  {
    segment: 'part2',
    title: 'Part 2',
    icon: <ShoppingCartIcon />,
  },
]
