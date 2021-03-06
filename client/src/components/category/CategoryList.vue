<template>
  <div v-if="categories" class="animate-fade-up">
    <div class="table-list">
      <category
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @categoryDeleted="categoryDeleted"
        @categoryEdited="categoryEdited"
        class="p-3"
      >
      </category>
    </div>

    <div v-if="!showAddCategory" @click="showAddCategory = true" class="my-2">
      <div class="text-center">
        <button class="button">New Category</button>
      </div>
    </div>
    <div v-else class="flex items-center justify-center space-x-2">
      <div>
        <input v-model="form.name" type="text" class="input" />
      </div>
      <div>
        <button @click="addCategory" class="button">
          Add
        </button>
      </div>
      <div>
        <button @click="showAddCategory = false" class="button button-danger">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { categoryService } from "@/services";
import CategoryComponent from "@/components/category/Category.vue";
import { defineComponent, ref, reactive, computed } from "@vue/composition-api";
import { Category, CategoryCreate } from "@/types";
import { categoryStore } from "@/store";

export default defineComponent({
  name: "CategoryList",
  components: {
    Category: CategoryComponent
  },

  setup(props, { root }) {
    const categories = computed<Category[]>(categoryStore.getters.categories);
    const showAddCategory = ref<boolean>(false);
    const form = reactive<CategoryCreate>({
      name: ""
    });

    // reload categories
    categoryStore.mutations.loadCategories();

    const addCategory = async () => {
      try {
        await categoryService.create(form);
      } catch {
        root.$toasted.error("Error creating category");
        return;
      }
      root.$toasted.success("Category created");
      showAddCategory.value = false;
      form.name = "";
      categoryStore.mutations.loadCategories();
    };

    const categoryDeleted = async (id: number) => {
      if (
        !confirm("Are you sure you want to permanently delete this category?")
      )
        return;

      try {
        await categoryService.delete(id);
      } catch {
        root.$toasted.error("Error while deleting category");
      }
      categoryStore.mutations.loadCategories();
    };

    const categoryEdited = async (category: Category) => {
      try {
        await categoryService.update(category.id, {
          name: category.name
        });
      } catch {
        root.$toasted.error("Error while updating category");
      }
      categoryStore.mutations.loadCategories();
    };

    return {
      categories,
      showAddCategory,
      form,
      addCategory,
      categoryEdited,
      categoryDeleted
    };
  }
});
</script>
