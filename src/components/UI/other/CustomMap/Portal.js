import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';


const Portal =
    ({ children, getHTMLElementId }) => {
        const mount = document.getElementById(getHTMLElementId)
        const el = document.createElement('div')
        useEffect(() => {
            if (mount) mount.appendChild(el)
            return () => {
                if (mount) mount.removeChild(el)
            }
        }, [el, mount])
        if (!mount) return null
        return createPortal(children, el)
    }

export default Portal