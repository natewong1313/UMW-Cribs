import Navbar from "@/components/Navbar"
import Button from "@/components/ui/Button"

const components = [
  {
    title: "Button",
    href: "#buttons",
    content: (
      <div className="">
        <div className="space-x-2">
          <Button>Primary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
        <div className="space-x-2 mt-3 flex">
          <Button isLoading={true} loadingText="Loading...">
            Primary Button
          </Button>
          <Button variant="danger" disabled>
            Disabled Button
          </Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    ),
  },
  {
    title: "Input",
    href: "#input",
  },
  {
    title: "Select",
    href: "#select",
  },
  {
    title: "Dropdown",
    href: "#dropdown",
  },
  {
    title: "Date Picker",
    href: "#datepicker",
  },
]
export default function ComponentsPage() {
  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="w-64 bg-gray-100 py-4 px-6">
          <h1 className="font-semibold">Components</h1>
          <ul className="mt-4">
            {components.map(component => (
              <li key={component.title}>
                <a
                  href={component.href}
                  className="block py-1.5 text-sm hover:underline"
                >
                  {component.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          {components.map(component => (
            <div
              key={component.title}
              id={component.href.replace("#", "")}
              className="py-8 px-6"
            >
              <h1 className="font-semibold text-2xl">{component.title}</h1>
              <div className="mt-2">{component.content}</div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="max-w-5xl mx-auto py-8 px-6">
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
      </div> */}
    </>
  )
}
