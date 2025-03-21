'use client'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { Branding } from '@toolpad/core/AppProvider'
import { logout } from '@/actions/auth.actions'
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton'
import { Button } from '@/components/ui/Button/Button'
import { useRouter } from 'next/navigation'
const handleLogout = async () => {
  const response = await logout()
  // if (response.ok) {
  //   ShowNotification('Đăng xuất thành công', 'success')
  // } else {
  //   ShowNotification('Đăng xuất thất bại', 'error')
  // }
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
