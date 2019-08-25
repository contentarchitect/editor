
const convertHtmlToBlocks = function (html) {
    return [
        {
            id: 6,
            name: "Header",
            level: 1,
            content: "Deneme deneme",
        },
        {
            id: 5,
            name: "Table",
            table: [],
        },
        {
            id: 1,
            name: "Title",
            level: 1,
            content: "Bismillah"
        },
        {
            id: 2,
            name: "Image",
            imageCount: 1,
            images: [
                { image: null, caption: null }
            ]
        },
        {
            id: 3,
            name: "Spacer",
            height: 50
        },
        {
            id: 4,
            name: "Divider",
            dividerType: "star"
        }
    ];
    // return [
        // {
        //     id: 1,
        //     component: () => import("@/components/Image")
        // },
        // {
        //     id: 2,
        //     component: () => import("@/components/Paragraph"),
        //     content: "Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. Lorem Ipsum, adı bilinmeyen bir matbaacının bir hurufat numune kitabı oluşturmak üzere bir yazı galerisini alarak karıştırdığı 1500'lerden beri endüstri standardı sahte metinler olarak kullanılmıştır. Beşyüz yıl boyunca varlığını sürdürmekle kalmamış, aynı zamanda pek değişmeden elektronik dizgiye de sıçramıştır. 1960'larda Lorem Ipsum pasajları da içeren Letraset yapraklarının yayınlanması ile ve yakın zamanda Aldus PageMaker gibi Lorem Ipsum sürümleri içeren masaüstü yayıncılık yazılımları ile popüler olmuştur."
        // },
        // {
        //     id: 3,
        //     component: () => import("@/components/Paragraph"),
        //     content: "Lorem ipsum dolor sit amet."
        // },
        // {
        //     id: 4,
        //     component: () => import("@/components/Paragraph"),
        //     content: "Lorem Ipsum, dizgi ve baskı endüstrisinde kullanılan mıgır metinlerdir. "
        // },
        // {
        //     id: 5,
        //     component: () => import("@/components/Table"),
        //     table: []
        // },
    // ]
}

export default convertHtmlToBlocks;