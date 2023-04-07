const treeData = [{
    areaId: 0,
    areaName: '信息设施（交换机、服务器、路由器）',
    areaType: 0,
    children: [{
            areaId: 1,
            areaName: '程控交换',
            areaType: 1,
            children: [{
                areaId: 11,
                areaName: '电话机及配件（耳麦等）',
                areaType: 2,
            }, ],
        },
        {
            areaId: 2,
            areaName: '信息化应用',
            areaType: 1,
            children: [{
                areaId: 21,
                areaName: '其他应用',
                areaType: 2,
            }, ],
        }
    ],
}, ]

export {
    treeData
}