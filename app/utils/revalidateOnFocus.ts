import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export function useRevalidateOnFocus() {
  let navigate = useNavigate();

  const onFocus = useCallback(()=>{
    if(!document.hidden){
        navigate(".", { replace: true });
    }
  },[navigate])

  useEffect(()=>{
    
    document.addEventListener("visibilitychange",onFocus)

    return ()=>{
        document.removeEventListener("visibilitychange",onFocus)
    }

  },[onFocus]);


}