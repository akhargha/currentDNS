import { Navigate } from 'react-router-dom'

function DomainMatchCheckPage() {
  // This page is no longer needed since SignupFormPlaceholder handles routing directly.
  return <Navigate to="/signup" replace />
}

export default DomainMatchCheckPage
