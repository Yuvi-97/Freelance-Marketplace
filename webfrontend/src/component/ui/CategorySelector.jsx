import { useState } from "react";

function CategorySelector({ onChange }) {
  const availableCategories = [
    "Web Development",
    "Mobile Development",
    "Design & Creative",
    "Writing & Translation",
    "Digital Marketing",
    "Data Science",
    "DevOps & Cloud",
    "Other",
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (category) => {
    let updatedCategories;
    if (selectedCategories.includes(category)) {
      updatedCategories = selectedCategories.filter((c) => c !== category);
    } else {
      updatedCategories = [...selectedCategories, category];
    }
    setSelectedCategories(updatedCategories);
    onChange(updatedCategories); 
  };

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">Select Categories</h3>
      <div className="grid grid-cols-2 gap-2">
        {availableCategories.map((category) => (
          <label key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={category}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCheckboxChange(category)}
              className="accent-blue-600"
            />
            <span>{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default CategorySelector;
