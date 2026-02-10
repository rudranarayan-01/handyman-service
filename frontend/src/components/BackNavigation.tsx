import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const BackNavigation = () => {
    return (
        <div>
            <nav className="top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/categories" className="flex items-center gap-2 font-bold text-gray-800 hover:text-blue-600 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back to Categories</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}

export default BackNavigation