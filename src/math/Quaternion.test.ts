import { Quaternion } from "./Quaternion.js";
import { Vector3 } from "./Vector3.js";

test("Quaternion toEulerAngle", ()=>{
    const q = new Quaternion(0.128, 0.145, 0.269, 0.944);
    const e = q.toEulerAngles();

    console.log(e);

    expect(e.isEqual(new Vector3(0.175077423453331, 0.34970852732658386, 0.5247366428375244))).toBe(true);
});
