import { CategoryProvider } from "../context/CategoryContext";
import CategoryTable from "../components/CategoryTable";

export default function CategoryPage() {
  return (
    <CategoryProvider>
      <CategoryTable />
    </CategoryProvider>
  );
}
