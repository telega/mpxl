export const PPixelSort = (p: any, toolData: any) => {
    //const d = p.pixelDensity();
    p.loadPixels();
    const toolAreaWidth =
        toolData.point.x > toolData.endPoint.x
            ? toolData.point.x - toolData.endPoint.x
            : toolData.endPoint.x - toolData.point.x;
    const toolAreaHeight =
        toolData.point.y > toolData.endPoint.y
            ? toolData.point.y - toolData.endPoint.y
            : toolData.endPoint.y - toolData.point.y;

    //let pixels = [];

    for (let i = 0; i < toolAreaHeight; i++) {
        let rowArray = [];
        for (let j = 0; j < toolAreaWidth; j++) {
            let pixelArray = p.get(toolData.point.x + j, toolData.point.y + i);
            rowArray.push(pixelArray);
        }

        rowArray.sort((a, b) => {
            return a[0] - b[0];
        });

        for (let j = 0; j < toolAreaWidth; j++) {
            p.set(
                toolData.point.x + j,
                toolData.point.y + i,
                p.color(
                    `rgba(${rowArray[j][0]},${rowArray[j][1]},${
                        rowArray[j][2]
                    },${rowArray[j][3]})`
                )
            );
        }
    }

    p.updatePixels();
};
