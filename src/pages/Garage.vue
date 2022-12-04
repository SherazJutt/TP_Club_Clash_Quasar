<template>
  <div class="q-pa-md">
    <q-table :rows="rows" :columns="columns" row-key="name" class="text-center" />
  </div>
</template>

<script>
const columns = [

  { label: 'Car Name', align: 'Center', field: 'car_name' },
  { label: 'Epics Applied', align: 'Center', field: 'car_epics' },
  { label: 'Car Rank', align: 'Center', field: 'car_rank' },
  { label: 'Car Status', align: 'Center', field: 'car_gold' },
]

const rows = [
  {
    car_name: 'Frozen Yogurt',
    car_epics: 8,
    car_rank: 5880,
    car_gold: true,

  }
]

export default {
  setup() {
    return {
      columns,
      rows
    }
  }

}
</script>
