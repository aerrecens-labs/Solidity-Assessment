import { ReactNode, useState, useEffect } from 'react'
import { Box, Drawer, Typography, IconButton, CssBaseline, useMediaQuery, useTheme } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import PieChartIcon from '@mui/icons-material/PieChart'
import SettingsIcon from '@mui/icons-material/Settings'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ScienceIcon from '@mui/icons-material/Science'
import PersonIcon from '@mui/icons-material/Person'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '../../state/uiStore'
import { ProfileModal } from '../common/ProfileModal'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { useDashboardStore } from '../../store/dashboardStore'

const drawerWidth = 200
const collapsedDrawerWidth = 64

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const { showGradients, enableAnimations, toggleProfile } = useUIStore()
  const { isFullScreen, setIsFullScreen, setView } = useDashboardStore()

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange)
  }, [setIsFullScreen])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  // Auto-collapse sidebar when on investment-related routes
  useEffect(() => {
    const isInvestmentRoute = location.pathname.includes('/app/investment') ||
      location.pathname.includes('/app/crypto-fund') ||
      location.pathname.includes('/app/portfolio') ||
      location.pathname.includes('/app/wallets') ||
      location.pathname.includes('/app/overview') // Collapsing for Dashboard View

    if (isInvestmentRoute) {
      setCollapsed(true)
    }
  }, [location.pathname])

  const navItems = [
    { to: '/', icon: <AccountBalanceIcon sx={{ color: 'primary.main' }} />, label: 'Treasury', view: 'TREASURY' as const },
    { to: '/app/overview', icon: <DashboardIcon sx={{ color: 'primary.main' }} />, label: 'Overview', view: 'MARKET' as const },
    { to: '/app/wallets', icon: <AccountBalanceWalletIcon sx={{ color: 'primary.main' }} />, label: 'Wallets' },
    { to: '/app/portfolio', icon: <PieChartIcon sx={{ color: 'primary.main' }} />, label: 'Portfolio' },
    { to: '/app/investment', icon: <TrendingUpIcon sx={{ color: 'primary.main' }} />, label: 'Invest' },
    { to: '/app/investment-portfolio', icon: <ShowChartIcon sx={{ color: 'primary.main' }} />, label: 'Active Invs.' },
    { to: '/app/crypto-test', icon: <ScienceIcon sx={{ color: 'primary.main' }} />, label: 'Crypto Test' },
  ] as const

  const drawer = (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#13141b] to-[#0b0c10] backdrop-blur-md transition-colors border-r border-white/5">
      <div className={`px-6 py-6 transition-all duration-300 ${collapsed ? 'px-2' : ''}`}>
        {!collapsed && (
          <>
            <Typography variant="h6" className="text-[var(--accent)] font-black tracking-widest font-metal">CRYPTIC</Typography>
            <Typography variant="body2" className="text-slate-300">Growth made simple</Typography>
          </>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            color: 'white',
            position: 'absolute',
            right: collapsed ? 8 : 16,
            top: 16,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <nav className={`p-4 space-y-2 flex-1 transition-all duration-300 ${collapsed ? 'px-2' : ''}`}>
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${isActive ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'hover:bg-[#121214] text-slate-300'}`}
              onClick={() => {
                setMobileOpen(false)
                if ('view' in item && item.view) setView(item.view)
              }}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          </motion.div>
        ))}
      </nav>
      <div className={`p-4 transition-all duration-300 border-t border-white/5 flex items-center ${collapsed ? 'flex-col gap-4 justify-center' : 'justify-between'}`}>
        <div className={`flex items-center ${collapsed ? 'flex-col gap-4' : 'gap-3'}`}>
          <IconButton
            size="small"
            sx={{ color: 'rgb(148, 163, 184)', '&:hover': { color: 'white' }, p: 0 }}
            title="Profile"
            onClick={toggleProfile}
          >
            <PersonIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </div>
        {!collapsed && <div className="text-[10px] text-slate-500 font-mono tracking-widest">v0.1</div>}
      </div>
    </div>
  )

  const currentDrawerWidth = collapsed ? collapsedDrawerWidth : drawerWidth
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = React.useRef(0)

  // Optimized Scroll Handler
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLElement>) => {
    if (!isMobile) return
    const target = e.target as HTMLElement
    const currentScroll = target.scrollTop

    // Buffer to prevent jitter on small scrolls
    if (Math.abs(currentScroll - lastScrollY.current) < 20) return

    // Hide if scrolling down & not at top, Show if scrolling up
    if (currentScroll > lastScrollY.current && currentScroll > 60) {
      setNavVisible(false)
    } else {
      setNavVisible(true)
    }
    lastScrollY.current = currentScroll
  }, [isMobile])

  return (
    <Box
      sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}
      className={`${showGradients ? 'theme-gradients' : ''} ${!enableAnimations ? 'disable-animations' : ''}`}
      onScrollCapture={handleScroll}
    >
      <CssBaseline />

      {/* Conditionally render Nav based on isFullScreen */}
      {!isFullScreen && !isMobile && (
        <Box component="nav" sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 }, position: 'fixed', height: '100vh', zIndex: (theme) => theme.zIndex.appBar - 1 }} aria-label="mailbox folders">
          {/* ... drawer content ... */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: 'none',
                backgroundColor: 'transparent',
                backgroundImage: 'none'
              },
              '& .MuiBackdrop-root': { backgroundColor: 'transparent' }
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-sizing',
                width: currentDrawerWidth,
                borderRight: 'none',
                backgroundColor: 'transparent',
                backgroundImage: 'none',
                transition: 'width 0.3s ease'
              }
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}

      {/* Conditionally render Mobile Nav */}
      <AnimatePresence>
        {!isFullScreen && isMobile && navVisible && (
          // ... mobile nav content ...
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '16px',
              right: '16px',
              zIndex: 1400, // High z-index to sit above everything
              pointerEvents: 'none' // Allows clicks pass through the empty space around the bar
            }}
          >
            {/* ... content ... */}
            <div className="pointer-events-auto bg-[#13141b]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 flex items-center justify-between px-2 py-2">
              {navItems.filter(i => !(i as any).desktopOnly && i.label !== 'Crypto Test').map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => {
                    if ('view' in item && item.view) setView(item.view)
                  }}
                  className="relative flex flex-col items-center justify-center p-1 flex-1 h-[56px] min-w-[56px] group active:scale-95 transition-transform duration-100"
                >
                  {({ isActive }) => (
                    <>
                      {/* Active "Lamp" Glow Effect */}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-lamp"
                          className="absolute inset-0"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        >
                          {/* Top Light Bar */}
                          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-blue-400 shadow-[0_2px_12px_rgba(59,130,246,0.8)] rounded-full" />
                          {/* Gradient Wash */}
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-xl" />
                        </motion.div>
                      )}

                      {/* Icon Animation */}
                      <div className={`relative z-10 transition-all duration-300 ${isActive ? '-translate-y-1' : 'translate-y-1'}`}>
                        {React.cloneElement(item.icon as React.ReactElement, {
                          sx: {
                            fontSize: 24,
                            color: isActive ? '#fff' : '#64748b',
                            filter: isActive ? 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' : 'none'
                          }
                        })}
                      </div>

                      {/* Label Fade In */}
                      <motion.span
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 4 }}
                        className="text-[10px] font-bold text-white absolute bottom-1.5"
                      >
                        {item.label === 'Overview' ? 'Home' : item.label === 'Active Invs.' ? 'Active' : item.label}
                      </motion.span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: location.pathname === '/' || location.pathname.includes('/app/overview') ? 0 : { xs: 2, md: 4 },
          minWidth: 0,
          ml: { sm: isMobile || isFullScreen ? 0 : `${currentDrawerWidth}px` }, // Set ml to 0 if isFullScreen
          transition: 'margin-left 0.3s ease',
          pb: isMobile ? '120px' : '0',
          overflowY: 'auto',
          height: '100%',
        }}
      >

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </Box>
      <ProfileModal />
    </Box>
  );
}
