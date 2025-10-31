'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LogOut, Home } from 'lucide-react'
import Link from 'next/link'

export function DashboardHeader() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-red-600">CD Onda Admin</h2>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Ver Sitio Web
              </Button>
            </Link>
          </div>
          <Button 
            variant="outline" 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  )
}

