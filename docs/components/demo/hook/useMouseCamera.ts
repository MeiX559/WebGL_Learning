import { ref } from 'vue'

interface CameraOptionsTypes {
  moveOption: (diffX: number, diffY: number) => void
  upOption?: (endX: number, endY: number) => void
  downOption?: (startX: number, startY: number) => void
}

const calc = (arg: number) => {
  const basic = 100
  return arg / basic
}

export function useMouseCamera({ moveOption, upOption, downOption }: CameraOptionsTypes) {
  const canDrag = ref(false)

  let mouseDownX = 0
  let mouseDownY = 0

  // 鼠标移动事件
  const mousemove = (e: MouseEvent) => {
    if (!canDrag.value) return

    const diffX = calc(e.offsetX - mouseDownX)
    const diffY = calc(e.offsetY - mouseDownY)

    moveOption(diffX, diffY)
  }

  // 鼠标按下
  const mousedown = (e: MouseEvent) => {
    canDrag.value = true

    mouseDownX = e.offsetX
    mouseDownY = e.offsetY

    downOption && downOption(mouseDownX, mouseDownY)
  }

  // 鼠标移出
  const mouseleave = () => {
    canDrag.value = false
  }

  // 鼠标抬起
  const mouseup = (e: MouseEvent) => {
    canDrag.value = false
    const endX = calc(e.offsetX - mouseDownX)
    const endY = calc(e.offsetY - mouseDownY)

    upOption && upOption(endX, endY)
  }

  return {
    mousemove,
    mousedown,
    mouseleave,
    mouseup
  }
}
