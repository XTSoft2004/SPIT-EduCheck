'use client'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Branding } from '@toolpad/core/AppProvider'
import { logout } from '@/actions/auth.actions'
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton'
import { Button } from '@/components/ui/Button/Button'
const handleLogout = async () => {
  await logout()
  window.location.href = '/login'
}
export const BRANDING: Branding = {
  logo: (
    <div className="flex items-center gap-4">
      <ThemeToggleButton />
      <Button
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
        onClick={handleLogout}
      >
        Đăng xuất
      </Button>
    </div>
  ),
  title: '',
  homeUrl: '/',
}
