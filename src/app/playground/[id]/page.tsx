import PlaygroundPage from "../page";

// For the UI shell, a saved playground uses the identical layout
// as the main playground but will eventually fetch data using the ID.
export default function SavedPlaygroundPage() {
  // We can eventually use `id` from await params
  return <PlaygroundPage />;
}
