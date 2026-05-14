

import './App.css'
import {SignedIn, SignInButton, SignOutButton, UserButton} from "@clerk/clerk-react"

function App() {

  return (
    <>
      <h1>welcome to the app</h1>
      <SignOut>
        <SignInButton mode="modal">
          <button>Login</button>
        </SignInButton>
      </SignOut>
      
      <SignedIn>
        <SignOutButton/>
      </SignedIn>
      <UserButton/>
    </>
  )
}

export default App
