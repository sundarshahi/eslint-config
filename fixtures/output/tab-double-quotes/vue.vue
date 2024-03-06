<template>
	<div>
		<h1>
			{{ greeting }}
		</h1>
		<button @click="incrementCounter">Click me!</button>
		<p>Counter: {{ counter }}</p>
		<ul>
			<li
				v-for=" number in counter "
				:key="number"
				class="static"
				:class="[{ active: number === 1 }]"
			/>
		</ul>
	</div>
</template>

<script setup>
// Define reactive data and props
import { ref } from "vue"

defineExpose({
	plusOne() {
		counter.value++
	},
})

const greeting = ref(`Hello, Vue 3!${1}`)
let counter = ref(0)

// Define a function
function incrementCounter() {
	counter.value++
}
</script>
