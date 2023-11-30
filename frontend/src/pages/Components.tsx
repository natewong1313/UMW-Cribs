import Navbar from "@/components/Navbar"
import Button from "@/components/ui/Button"

export default function ComponentsPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto py-8 px-6">
        <div className="pb-4">
          <h1 className="font-semibold text-2xl">Browse Components</h1>
          <p className="mt-1">
            This library is heavily inspired by{" "}
            <a
              href="https://ui.shadcn.com/"
              target="_blank"
              className="text-blue-500"
            >
              ui.shadcn.com
            </a>
          </p>
        </div>
        <p className="font-medium">Buttons</p>
        <div className="flex space-x-2 mt-1">
          <Button>Primary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    </>
  )
}
