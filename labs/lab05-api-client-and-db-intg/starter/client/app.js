const API_BASE_URL = "http://localhost:3000";

const loadButton = document.querySelector("#load-items");
const itemList = document.querySelector("#items");
const form = document.querySelector("#add-item-form");
const itemNameInput = document.querySelector("#item-name");
const itemQuantityInput = document.querySelector("#item-quantity");
const itemCategorySelect = document.querySelector("#item-category");
const categoryForm = document.querySelector("#add-category-form");
const categoryNameInput = document.querySelector("#category-name");
const statusBox = document.querySelector("#status");

function setStatus(message) {
  statusBox.textContent = message;
}

function renderItems(items) {
  itemList.replaceChildren();

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "item-row";

    const description = document.createElement("span");
    const category = item.category_name ?? "Uncategorized";
    description.textContent = `${item.id}: ${item.name} (${item.quantity}) — ${category}`;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "item-buttons";

    // button for editting items
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editItem(item));

    // button for deleting items
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteItem(item.id));

    buttonGroup.append(editButton, deleteButton);
    li.append(description, buttonGroup);
    itemList.appendChild(li);
  }
}

// loading the available categories
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `GET /api/categories failed with status ${response.status}`);
    }

    itemCategorySelect.replaceChildren();
    for (const category of data.categories) {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      itemCategorySelect.appendChild(option);
    }
  } catch (error) {
    setStatus(error.message);
  }
}

// loading the available items
async function loadItems() {
  setStatus("Loading items...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`);

    if (!response.ok) {
      throw new Error(`GET /api/items failed with status ${response.status}`);
    }

    const data = await response.json();
    renderItems(data.items);
    setStatus("Items loaded.");
  } catch (error) {
    setStatus(error.message);
  }
}

// adding items to the db
async function addItem(name, quantity, categoryId) {
  setStatus("Adding item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, quantity, categoryId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/items failed with status ${response.status}`);
    }

    setStatus(`Added item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

// deleting items from the db
async function deleteItem(id) {
  setStatus("Deleting item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: "DELETE"
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `DELETE /api/items/${id} failed with status ${response.status}`);
    }

    setStatus(`Deleted item: ${data.item.name}`);
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

// editing existing items
async function editItem(item) {
  const nameInput = window.prompt("Enter the item name:", item.name);
  if (nameInput === null) {
    return;
  }

  const quantityInput = window.prompt("Enter the item quantity:", String(item.quantity));
  if (quantityInput === null) {
    return;
  }

  const name = nameInput.trim();
  const quantity = Number(quantityInput);

  if (!name || !Number.isInteger(quantity) || quantity < 0) {
    setStatus("Enter a name and a non-negative integer quantity.");
    return;
  }

  const updates = {};
  if (name !== item.name) {
    updates.name = name;
  }
  if (quantity !== item.quantity) {
    updates.quantity = quantity;
  }

  if (Object.keys(updates).length === 0) {
    setStatus("No changes were made.");
    return;
  }

  setStatus("Editing item...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `PATCH /api/items/${item.id} failed with status ${response.status}`);
    }

    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
}

// adding new categories
async function addCategory(name) {
  setStatus("Adding category...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message ?? `POST /api/categories failed with status ${response.status}`);
    }

    setStatus(`Added category: ${data.category.name}`);
    await loadCategories();
    itemCategorySelect.value = String(data.category.id);
  } catch (error) {
    setStatus(error.message);
  }
}

loadButton.addEventListener("click", loadItems);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = itemNameInput.value.trim();
  const quantity = Number(itemQuantityInput.value);
  const categoryId = Number(itemCategorySelect.value);

  if (!name || !Number.isInteger(quantity) || quantity < 0 || !Number.isInteger(categoryId)) {
    setStatus("Enter a name, non-negative integer quantity, and category.");
    return;
  }

  itemNameInput.value = "";
  itemQuantityInput.value = "0";
  await addItem(name, quantity, categoryId);
});

categoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = categoryNameInput.value.trim();
  if (!name) {
    setStatus("Enter a category name.");
    return;
  }

  categoryNameInput.value = "";
  await addCategory(name);
});

await loadCategories();
await loadItems();
