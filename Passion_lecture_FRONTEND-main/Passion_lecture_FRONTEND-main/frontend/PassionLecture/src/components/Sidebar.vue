<template>
  <div class="sidebar-overlay" :class="{ hidden: !isOpen }" @click="onClose">
    <div class="sidebar" @click.stop>
      <nav class="nav-container">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.href"
          class="nav-item"
          :class="{ active: $route.path === item.href }"
        >
          <!-- Use component when available, otherwise fallback to image -->
          <img v-if="!areIconsAvailable" :src="item.iconImage" class="nav-icon" alt="icon" />
          <component v-else :is="item.icon" class="nav-icon" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

// TODO: Uncomment when lucide-vue-next is installed
// import { Edit, BookOpen, Layers } from 'lucide-vue-next'

/**
 * Component that displays a sidebar navigation menu
 * @component Sidebar
 */
export default defineComponent({
  name: 'Sidebar',
  components: {
    // Will be available when uncommented above
    // Edit,
    // BookOpen,
    // Layers,
  },
  props: {
    /** Controls the visibility of the sidebar */
    isOpen: {
      type: Boolean,
      required: true,
    },
    /** Callback function to close the sidebar */
    onClose: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const route = useRoute()
    const areIconsAvailable = ref(false) // Set to true when icons are available

    // Use these mock objects until real components are available
    const mockIcons = {
      Edit: 'Edit',
      Layers: 'Layers',
      BookOpen: 'BookOpen',
    }

    /** Navigation items configuration */
    const navItems = [
      {
        name: 'Create',
        href: '/create',
        icon: mockIcons.Edit,
        iconImage: '../../public/images/createBook.png',
      },
      {
        name: 'Categories',
        href: '/categories',
        icon: mockIcons.Layers,
        iconImage: '../../public/images/categories.png',
      },
      {
        name: 'My Books',
        href: '/my-books',
        icon: mockIcons.BookOpen,
        iconImage: '../../public/images/myBooks.png',
      },
    ]

    return {
      navItems,
      areIconsAvailable,
    }
  },
})
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.hidden {
  display: none;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 16rem;
  background-color: var(--medium-blue, #3c5a78);
  padding: 1rem;
  z-index: 50;
}

.nav-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 4rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.375rem;
  color: white;
  text-decoration: none;
}

.nav-item:not(.active):hover {
  background-color: var(--dark-blue, #1a3c5a);
  transition: background-color 0.3s;
}

.nav-item.active {
  background-color: var(--dark-blue, #1a3c5a);
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}

.nav-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}
</style>
