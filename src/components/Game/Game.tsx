import React, { useContext, useEffect, useRef } from 'react';
import { CanvasElement } from './styled';
import WhackAMole from './game/WhackAMole';
import { ThemeContext } from '../App/App';

export default () => {
  const canvas = useRef(null);
  const theme = useContext(ThemeContext);
  useEffect(() => {
    const pixi = new WhackAMole(canvas.current, theme);
    canvas.current.setAttribute('width', window.innerWidth);
    canvas.current.setAttribute('height', window.innerHeight);
  }, [])
  return (
    <CanvasElement
      ref={canvas}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  )
}
