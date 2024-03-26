const OFFSET = 40

const add_listener = () => {
    let component = document.querySelectorAll(".charts-point");
    let tooltip = document.getElementById("tooltip")
    component.forEach(circle => {
        circle.addEventListener('mouseover', function (event) {
            const text = this.getAttribute('data-tooltip');
            tooltip.textContent = text;
            tooltip.style.display = 'block';
            tooltip.style.visibility = 'visible';
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
        });

        circle.addEventListener('mouseout', function () {
            tooltip.style.visibility = 'hidden';
        });
    })
}

const get_limit_x = (data) => {
    let maximum = data[0][0]
    let minimum = data[0][0]
    data.forEach(elem => {
        maximum = elem[0] > maximum ? elem[0] : maximum
        minimum = elem[0] < minimum ? elem[0] : minimum
    })
    return [maximum, minimum]
}

const get_limit_y = (data) => {
    let maximum = data[0][1]
    let minimum = data[0][1]
    data.forEach(elem => {
        maximum = elem[1] > maximum ? elem[1] : maximum
        minimum = elem[1] < minimum ? elem[1] : minimum
    })
    return [maximum, minimum]
}

const define_data_limit = (width, height, data) => {
    let limit_x = get_limit_x(data)
    let limit_y = get_limit_y(data)
    let distance_x = limit_x[0] - limit_x[1]
    let distance_y = limit_y[0] - limit_y[1]

    console.log(distance_y)

    return [{ "distance": (width - OFFSET - OFFSET/2) / distance_x, "min": limit_x[1] }, { "distance": (height - OFFSET - OFFSET / 2) / distance_y, "min": limit_y[1] }]
}

const create_plot = (minX, maxX, minY, maxY, width, height) => {
    let distance_x = maxX - minX
    let distance_y = maxY - minY

    let dx = (width - OFFSET - OFFSET / 2) / 5
    let dy = (height - OFFSET - OFFSET / 2) / 5

    console.log(width / distance_x)

    let reponse = ``
    reponse += `<line x1="${OFFSET}" y1="${OFFSET / 2}" x2="${OFFSET}" y2="${height - OFFSET}" style="stroke:black;stroke-width:1"/>`
    reponse += `<line x1="${OFFSET}" y1="${height - OFFSET}" x2="${width - OFFSET / 2}" y2="${height - OFFSET}" style="stroke:black;stroke-width:1"/>`

    for(let e = 0; e != 5; e++){
        console.log("AHAHA" + (OFFSET - (dy*e)).toString())
        if(e != 0){
            reponse += `<line x1="${OFFSET}" y1="${height - OFFSET - (dy*e)}" x2="${OFFSET-4}" y2="${height - OFFSET - (dy*e)}" style="stroke:black;stroke-width:1"/>`
            reponse += `<line x1="${OFFSET + (dx*e)}" y1="${height - OFFSET}" x2="${OFFSET + (dx*e)}" y2="${height - OFFSET +4}" style="stroke:black;stroke-width:1"/>`
        }
        
        reponse += `<text x="${OFFSET-Math.floor((maxY / 5)*e).toString().length*12}" y="${height - OFFSET - (dy*e) + 5}" fill="black">${Math.floor(e != 0 ? (maxY / 5)*e : minY)}</text>`
        reponse += `<text x="${OFFSET + (dx*e) - (Math.floor((maxY / 5)*e).toString().length*5)}" y="${height - OFFSET / 2}" fill="black">${Math.floor(e != 0 ? (maxX / 5)*e : minX)}</text>`
    }




    return reponse
}


const linear_charts = (data, element_query) => {
    let element = document.querySelector(element_query)
    let circles = ``
    let lines = ``
    let width = element.offsetWidth
    let height = element.offsetHeight

    let distance = define_data_limit(width, height,data)

    data.sort(function (a, b) {
        return a[0] - b[0]
    })

    let actual_x = ((data[0][0] * distance[0]["distance"]) - (distance[0]["distance"] * distance[0]['min'])) + OFFSET
    let actual_y = (height - ((data[0][1] * distance[1]["distance"]) - (distance[1]["distance"] * distance[1]['min']))) - OFFSET
    let recup = 0

    console.log(distance)
    for (let e = 0; e != data.length; e++) {

        recup = [actual_x, actual_y]

        actual_x = e != 0 ? ((data[e][0] * distance[0]["distance"]) - (distance[0]["distance"] * distance[0]['min'])) + OFFSET : actual_x
        actual_y = e != 0 ? (height - ((data[e][1] * distance[1]["distance"]) - (distance[1]["distance"] * distance[1]['min']))) - OFFSET : actual_y



        circles += `
        <circle class="charts-point" 
        data-tooltip="${data[e][0]}" 
        cx=${actual_x}
        cy=${actual_y} 
        r="2.5" 
        fill="blue">
        </circle>`

        if (e != 0) {
            lines += `
                <line x1="${recup[0]}" y1="${recup[1]}" x2="${actual_x}" y2="${actual_y}" style="stroke:red;stroke-width:2"/>
            `
        }
    }

    let limit_x = get_limit_x(data)
    let limit_y = get_limit_y(data)


    let svg = `<svg width="${width}" height="${height}">
        ${lines}
        ${create_plot(limit_x[1], limit_x[0], limit_y[1], limit_y[0], width, height)}
        ${data.length > 100 ? "" : circles}
    </svg>`

    element.innerHTML += svg
    if (!document.body.innerHTML.includes('<div id="tooltip" style="display: none; position: absolute; background: rgb(184, 184, 184); color: rgb(0, 0, 0); padding: 8px; border-radius: 6px;"></div>')) {
        document.body.innerHTML += '<div id="tooltip" style="display: none; position: absolute; background: rgb(184, 184, 184); color: rgb(0, 0, 0); padding: 8px; border-radius: 6px;"></div>'
    }

    add_listener()
}


const generate_data = (number) =>{
    let res = []
    for(let e = 0; e!= number ; e++){
        res.push([Math.floor(Math.random() * 300), Math.floor(Math.random() * 1000)])
    }
    return res
}

document.getElementById("charts").addEventListener("click", () => {
    let data = generate_data(50)
    linear_charts(data, "#charts")
})
