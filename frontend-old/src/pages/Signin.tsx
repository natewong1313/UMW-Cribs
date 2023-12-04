import { FormEvent } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase"

interface FormElements extends HTMLFormControlsCollection {
  emailInput: HTMLInputElement
  passwordInput: HTMLInputElement
}
interface SigninForm extends HTMLFormElement {
  elements: FormElements
}

export default function SigninPage() {
  const onFormSubmit = async (e: FormEvent<SigninForm>) => {
    e.preventDefault()
    const email = e.currentTarget.elements.emailInput.value
    const password = e.currentTarget.elements.passwordInput.value
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const idToken = await userCredential.user.getIdToken()
    console.log(idToken)
  }
  return (
    <div className="flex items-center justify-center py-20">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md">
        <h1 className="text-lg font-semibold">Sign in to web-app-template</h1>
        <form onSubmit={onFormSubmit}>
          <input
            name="emailInput"
            type="email"
            className="w-full"
            placeholder="Enter email address"
          />
          <input
            name="passwordInput"
            type="password"
            className="w-full"
            placeholder="Enter password"
          />
          <button className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
