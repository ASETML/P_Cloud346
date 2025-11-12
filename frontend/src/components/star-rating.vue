<template>
  <div class="star-rating" :class="{ readonly: readOnly }">
    <div v-for="star in 5" :key="star" class="star-container">
      <div class="star-wrapper">
        <span class="star star-outline">★</span>
        <span class="star star-fill" :style="getStarStyle(star)">★</span>
      </div>
      <div
        class="star-half"
        @mousemove="!readOnly && handleHalfStar(star)"
        @click="!readOnly && handleHalfStar(star)"
        @mouseleave="!readOnly && resetHoverRating()"
      ></div>
      <div
        class="star-full"
        @mousemove="!readOnly && handleFullStar(star)"
        @click="!readOnly && handleFullStar(star)"
        @mouseleave="!readOnly && resetHoverRating()"
      ></div>
    </div>
  </div>
</template>

<script>
/**
 * Star rating component that allows users to rate items with half-star precision
 * @component StarRating
 */
export default {
  name: 'StarRating',
  props: {
    /** Current rating value (v-model) */
    modelValue: {
      type: Number,
      default: 0,
    },
    /** Initial rating value */
    initialRating: {
      type: Number,
      default: 0,
    },
    /** If true, prevents rating changes */
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      /** Current local rating value */
      localRating: this.modelValue || this.initialRating,
      /** Stores rating during hover */
      hoverRating: 0,
    }
  },
  methods: {
    /**
     * Calculates the fill percentage for each star based on current rating
     * @param {number} star - The star index (1-5)
     * @returns {Object} CSS clip-path style to fill the star
     */
    getStarStyle(star) {
      // Use initial rating if read-only, otherwise use hover or local rating
      const currentRating = this.readOnly
        ? this.initialRating
        : this.hoverRating || this.localRating
      
      // Calculate percentage of star to fill
      // Each star represents 20% of the total rating (100% / 5 stars)
      const percentage = Math.min(100, Math.max(0, (currentRating - (star - 1)) * 100))
      
      // Return CSS clip-path to fill the star
      return {
        clipPath: `inset(0 ${100 - percentage}% 0 0)`,
      }
    },
    /**
     * Handles selection of half-star ratings
     * @param {number} star - The star index (1-5)
     */
    handleHalfStar(star) {
      if (this.readOnly) return // Prevent changes if read-only
      
      // Set hover state to half-star
      this.hoverRating = star - 0.5
      // Update actual rating
      this.setRating(star - 0.5)
    },
    /**
     * Handles full-star rating selection
     * @param {number} star - The star index (1-5)
     */
    handleFullStar(star) {
      if (this.readOnly) return
      this.hoverRating = star
      this.setRating(star)
    },
    /**
     * Updates the rating value and emits the change
     * @param {number} value - The new rating value (0-5)
     */
    setRating(value) {
      // Update local state
      this.localRating = value
      // Emit change to parent component
      this.$emit('update:modelValue', value)
    },
    /** Resets the hover rating */
    resetHoverRating() {
      this.hoverRating = 0
    },
  },
  watch: {
    /**
     * Updates local rating when modelValue changes
     * @param {number} newValue - The new rating value
     */
    modelValue: {
      handler(newValue) {
        this.localRating = newValue
      },
      immediate: true,
    },
  },
}
</script>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 0.25rem;
}

.star-container {
  position: relative;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.star-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  line-height: 1;
}

.star-outline {
  color: #ddd;
  z-index: 1;
}

.star-fill {
  color: #ffd700;
  z-index: 2;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.2s ease-in-out;
}

.star-half,
.star-full {
  position: absolute;
  top: 0;
  height: 100%;
  z-index: 3;
}

.star-half {
  left: 0;
  width: 50%;
}

.star-full {
  left: 50%;
  width: 50%;
}

.star-rating.readonly .star-container {
  cursor: default;
  pointer-events: none;
}

.star-container:hover .star-fill {
  color: #ffc107;
}
</style>
