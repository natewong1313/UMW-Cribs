import { Dialog, Transition } from "@headlessui/react"
import { IconX } from "@tabler/icons-react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  type UserCredential,
} from "firebase/auth"
import { Fragment, useRef, useState } from "react"
import { firebaseAuth, parseFireBaseError } from "../utils/firebase"
// import parseFireBaseError from "../utils/parseFirebaseError"
import Input from "./shared/Input"
import Label from "./shared/Label"
import { FirebaseError } from "firebase/app"
import { VerifyTokenResponse } from "../types/types"

type Props = {
  isOpen: boolean
  onClose: () => void
  page: number
  setPage: (page: number) => void
}
export default function AuthModal({ isOpen, onClose, page, setPage }: Props) {
  const emptyFocus = useRef(null)
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={onClose}
        initialFocus={emptyFocus}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute right-0 top-0 hidden pr-6 pt-6 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none "
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <IconX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {page == 0 ? (
                  <>
                    <Dialog.Title className="text-lg font-semibold">
                      Welcome back
                    </Dialog.Title>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Don&apos;t have an account?{" "}
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setPage(1)}
                      >
                        Sign up instead
                      </button>
                    </p>
                    <SigninForm />
                  </>
                ) : (
                  <>
                    <Dialog.Title className="text-lg font-semibold">
                      Create an account
                    </Dialog.Title>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      Already have an account?{" "}
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setPage(0)}
                      >
                        Sign in instead
                      </button>
                    </p>
                    <SignupForm />
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

interface SignupFormElements extends HTMLFormControlsCollection {
  firstName: HTMLInputElement
  lastName: HTMLInputElement
  email: HTMLInputElement
  password: HTMLInputElement
}
interface SignupFormElement extends HTMLFormElement {
  readonly elements: SignupFormElements
}

export function SignupForm() {
  const [showSpinner, setShowSpinner] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const onFormSubmit = async (event: React.FormEvent<SignupFormElement>) => {
    event.preventDefault()
    setShowSpinner(true)
    let userCredentials: UserCredential
    const { email, password, firstName, lastName } =
      event.currentTarget.elements
    try {
      userCredentials = await createUserWithEmailAndPassword(
        firebaseAuth,
        email.value,
        password.value
      )
    } catch (error) {
      setErrorMsg(parseFireBaseError(error as FirebaseError))
      setShowSpinner(false)
      return
    }
    await updateProfile(userCredentials.user, {
      displayName: `${firstName.value} ${lastName.value}`,
    })
    const idToken = await userCredentials.user.getIdToken()
    const response = await fetch("/api/user/verify", {
      headers: { Authorization: "Bearer " + idToken },
    })
    const data: VerifyTokenResponse = await response.json()
    if (data.verified) {
      window.location.reload()
    } else {
      setShowSpinner(false)
      setErrorMsg("Something went wrong. Please try again.")
    }
  }
  return (
    <form className="mt-4" onSubmit={onFormSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="firstName">First name</Label>
          <Input
            name="firstName"
            id="firstName"
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            name="lastName"
            id="lastName"
            placeholder="Enter last name"
            required
          />
        </div>
      </div>
      <Label htmlFor="email">Email address</Label>
      <div className="mt-1">
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email"
          required
        />
      </div>
      <Label htmlFor="password">Password</Label>
      <div className="mt-1">
        <input
          type="password"
          name="password"
          id="password"
          className="block w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-200 sm:text-sm sm:leading-6"
          placeholder="Enter password"
          required
        />
      </div>
      <div className="mt-2.5 flex items-center text-sm">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-transparent focus-visible:ring-blue-500"
          required
        />
        <label htmlFor="terms" className="ml-2">
          I agree to the{" "}
          <a href="/terms" className="text-blue-500 hover:underline">
            terms and conditions
          </a>
        </label>
      </div>
      <button
        type="submit"
        disabled={showSpinner}
        className="mt-4 flex w-full justify-center rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-blue-400"
      >
        {showSpinner ? (
          <svg
            aria-hidden="true"
            role="status"
            className="me-3 inline h-6 w-6 animate-spin p-1 text-white"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          "Sign up"
        )}
      </button>
      <p
        className={
          "text-center text-sm text-red-500 " + (errorMsg != "" && "mt-2")
        }
      >
        {errorMsg}
      </p>
    </form>
  )
}

interface SigninFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement
  password: HTMLInputElement
}
interface SigninFormElement extends HTMLFormElement {
  readonly elements: SigninFormElements
}

export function SigninForm() {
  const [showSpinner, setShowSpinner] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const onFormSubmit = async (event: React.FormEvent<SigninFormElement>) => {
    event.preventDefault()
    setShowSpinner(true)
    let userCredentials: UserCredential
    try {
      userCredentials = await signInWithEmailAndPassword(
        firebaseAuth,
        event.currentTarget.elements.email.value,
        event.currentTarget.elements.password.value
      )
    } catch (error) {
      setErrorMsg(parseFireBaseError(error as FirebaseError))
      setShowSpinner(false)
      return
    }
    const idToken = await userCredentials.user.getIdToken()
    const response = await fetch("/auth/verify", {
      headers: { Authorization: "Bearer " + idToken },
    })
    if (response.ok) {
      window.location.reload()
    } else {
      setShowSpinner(false)
    }
  }
  return (
    <form className="mt-4" onSubmit={onFormSubmit}>
      <Label htmlFor="email">Email address</Label>
      <div className="mt-1">
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email"
          required
        />
      </div>
      <Label htmlFor="password">Password</Label>
      <div className="mt-1">
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          required
        />
      </div>
      <button className="mt-2 text-sm font-medium text-gray-500 hover:underline">
        Forgot your password?
      </button>
      <button
        type="submit"
        disabled={showSpinner}
        className="mt-4 flex w-full justify-center rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-blue-400"
      >
        {showSpinner ? (
          <svg
            aria-hidden="true"
            role="status"
            className="me-3 inline h-6 w-6 animate-spin p-1 text-white"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          "Sign in"
        )}
      </button>
      <p
        className={
          "text-center text-sm text-red-500 " + (errorMsg != "" && "mt-2")
        }
      >
        {errorMsg}
      </p>
    </form>
  )
}
