export function mouseTracker(node: Node, {onMove}: {onMove: (x: number, y: number) => void}) {
    //@ts-expect-error
    const handleMouseMove = (event) =>{
        onMove(event.clientX, event.clientY)
    }

    node.addEventListener("mousemove", handleMouseMove);
    return {
        destroy() {
            node.removeEventListener("mousemove", handleMouseMove);
        }
    };
}



export function mouseClick(node:Node, {onClick}: {onClick:(x:number, y:number) => void} ) {
    //@ts-expect-error
    const handleClick = (event)  => {
        onClick(event.clientX, event.clientY)
    }
    node.addEventListener("mousemove", handleClick);
    return {
        destroy() {
            node.removeEventListener("click", handleClick)
        }
    }
}