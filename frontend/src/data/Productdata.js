export const productdata = {
    Springs:[
        {id:1, name: 'M Spring', description: 'Details about M Spring'},
        {id:2, name: 'Corner Spring', description: 'Details about Corner Spring'},
        {id:3, name: 'Scissor Spring', description: 'Details about Scissor Spring'},
        {id:4, name: 'Butterfly Spring', description: 'Details about Butterfly Spring'},
        {id:5, name: 'Bonnel Spring', description: 'Details about Bonnel Spring'},
        {id:6, name: 'Bonnel Spring Unit', description: 'Details about Bonnel Spring Unit'},
        {id:7, name: 'Pocketed Spring Unit', description: 'Details about Pocketed Spring Unit'},
        {id:8, name: 'Border Frame', description: 'Details about Border Frame'},
        {id:9, name: 'Connecting Tube', description: 'Details about Connecting Tube'},
    ],
    Accessories: [
        { id: 10, name: 'Quilting Thread', description: 'Details about Quilting Thread' },
        { id: 11, name: 'Tape edge Thread', description: 'Details about Tape edge Thread' },
        { id: 12, name: 'Sc6 Clips', description: 'Details about Sc6 Clips' },
        { id: 13, name: 'Staple pins p88 series', description: 'Details about Staple pins p88 series' },
        { id: 14, name: 'Cl72 clip', description: 'Details about Cl72 clip' },
        { id: 15, name: 'Cl 17 clip & roll', description: 'Details about Cl 17 clip & roll' },
        { id: 16, name: 'Mattress edge Tapes', description: 'Details about Mattress edge Tapes' },
        { id: 17, name: 'Padding tools', description: 'Details about Padding tools' },
        { id: 18, name: 'Clinching tools', description: 'Details about Clinching tools' },
        { id: 19, name: 'Hog ring tools', description: 'Details about Hog ring tools' },
    ],
    Machineries: [
        { id: 20, name: 'Foam sealing Machine', description: 'Details about Foam sealing Machine' },
        { 
            id: 21, 
            name: 'Mattress Sealing Machine', 
            description: 'Details about Mattress Sealing Machine',
            subProducts: [
              { id: 22, name: 'Manual Sealing Machine(Hand Operated)', description: 'Details about Manual Sealing Machine (hand operated)' },
              { id: 23, name: 'Semi Automatic Sealing Machine(Air Operated)', description: 'Details about Semi Automatic Sealing Machine (Air Operated)' },
              { id: 24, name: 'Fully Automated mattress Sealing machine', description: 'Details about Fully Automated mattress Sealing machine' },
            ]
        },
        { 
            id: 25, 
            name: 'Pillow Machine', 
            description: 'Details about Pillow Machine',
            subProducts: [
              { id: 26, name: 'Fiber opening Machine', description: 'Details about Fiber opening Machine' },
              { 
                id: 27, 
                name: 'Pillow Filling machine', 
                details: 'Details about Pillow Filling machine',
                subProducts: [
                  { id: 28, name: 'Manual filling machine', description: 'Details about Manual filling machine' },
                  { id: 29, name: 'Automatic filling Machine', description: 'Details about Automatic filling Machine' },
                ]
              },
              { id: 30, name: 'Pillow vacuum Compress packing Machine', description: 'Details about Pillow vacuum Compress packing Machine' },
            ]
        },
        { id: 31, name: 'Foam chipping or shredding Machine', description: 'Details about Foam chipping or shredding Machine' },
        { id: 32, name: 'Steel wire strighting machine', description: 'Details about Steel wire strighting machine' },
        { id: 33, name: 'Border wire bending Machine', description: 'Details about Border wire bending Machine' },
        { id: 34, name: 'Border wire jointing machine', description: 'Details about Border wire jointing machine' },
        {
            id: 35,
            name: 'Tape Edge Machine',
            description: 'Details about Tape Edge Machine',
            subProducts: [
              {
                id: 36,
                name: 'Manual Tape Edge Machine',
                description: 'Details about Manual Tape edge machine'
              },
              {
                id: 37,
                name: 'Semi Automatic Tape Edge Machine',
                description: 'Details about Semi Automatic Tape Edge machine'
              },
              {
                id: 38,
                name: 'Automatic Tape Edge Machine',
                description: 'Details about Automatic Tape edge machine'
              },
              {
                id: 39,
                name: 'Fully Automatic Tape Edge Machine (Conveyor Type)',
                description: 'Details about Fully Automatic tape edge machine (conveyor type)'
              }
            ]
        },
        {
            id: 40,
            name: 'Mattress Vacuum Compress packing Machine',
            description: 'Details about Mattress Vacuum Compress packing Machine',
            subProducts: [
              {
                id: 41,
                name: 'Manual Vacuum Compressing packing Machine',
                description: 'Details about Manual vacuum Compressing packing Machine'
              },
              {
                id: 42,
                name: 'Automatic Vacuum Compress packing machine',
                description: 'Details about Automatic Vacuum Compress packing machine',
                subProducts: [
                  {
                    id: 43,
                    name: 'Pre Assembly Conveyor',
                    description: 'Details about Pre Assembly Conveyor'
                  },
                  {
                    id: 44,
                    name: 'Inspection conveyor',
                    description: 'Details about Inspection conveyor'
                  },
                  {
                    id: 45,
                    name: 'Vacuum compress packing machine with conveyor belt',
                    description: 'Details about Vacuum compress packing machine with conveyor belt'
                  }
                ]
              }
            ]
        },
        {
            id: 46,
            name: 'Mattress Rolling Machine',
            description: 'Details about Mattress Rolling Machine',
            subProducts: [
              {
                id: 47,
                name: 'Semi Automatic Rolling Machine',
                description: 'Details about Semi Automatic Rolling Machine'
              },
              {
                id: 48,
                name: 'Automatic Rolling Machine',
                description: 'Details about Automatic rolling Machine'
              }
            ]
        },
        {
            id: 49,
            name: 'Spring Machine',
            description: 'Details about Spring Machine',
            subProducts: [
              {
                id: 50,
                name: 'Bonnel Machine',
                description: 'Details about Bonnel Machine',
                subProducts: [
                  {
                    id: 51,
                    name: 'Standard Automatic Bonnell Coiling Machine',
                    description: 'Details about Standard Automatic Bonnell Coiling Machine'
                  },
                  {
                    id: 52,
                    name: 'Bonnell Spring Assembly Machine',
                    description: 'Details about Bonnell Spring Assembly Machine'
                  },
                  {
                    id: 53,
                    name: 'Automatic Bonnell Spring Unit Production Line',
                    description: 'Details about Automatic Bonnell Spring Unit Production Line'
                  }
                ]
              },
              {
                id: 54,
                name: 'Pocketed Machine',
                description: 'Details about Pocketed Machine',
                subProducts: [
                  {
                    id: 55,
                    name: 'Standard Pocketed Coiling Machine',
                    description: 'Details about Standard Pocketed Coiling Machine'
                  },
                  {
                    id: 56,
                    name: 'Pocketed Spring Row Cutting Machine',
                    description: 'Details about Pocketed Spring Row Cutting Machine'
                  },
                  {
                    id: 57,
                    name: 'Pocketed Assembly Machine',
                    description: 'Details about Pocketed Assembly Machine'
                  },
                  {
                    id: 58,
                    name: 'Automatic Pocketed Spring Unit Production Line',
                    description: 'Details about Automatic Pocketed Spring Unit Production Line'
                  },
                  {
                    id: 59,
                    name: 'Ultrasonic Pocketed Sofa Unit Sealing Machine',
                    description: 'Details about Ultrasonic Pocketed Sofa Unit Sealing Machine'
                  },
                  {
                    id: 60,
                    name: 'Pocketed Unit Rolling Machine',
                    description: 'Details about Pocketed Unit Rolling Machine'
                  }
                ]
              }
            ]
        },
        {
            id: 61,
            name: 'Spring Durability Testing Machine for Bonnel & Pocketed Spring',
            description: 'Details about Spring Durability Testing Machine for Bonnel & Pocketed Spring'
        },
        {
            id: 62,
            name: '30l Capacity Glue Spray Tank',
            description: 'Details about 30l Capacity Glue Spray Tank'
        },
        {
            id: 63,
            name: 'Quilt Roll Winding Machine',
            description: 'Details about Quilt Roll Winding Machine'
        }
    ],
};