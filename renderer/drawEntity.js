function drawPoly(context, centerX, centerY, radius, sides, angle = 0, borderless, fill) {
    // Start drawing
    context.beginPath();
    if (sides instanceof Array) {
        let dx = Math.cos(angle);
        let dy = Math.sin(angle);
        for (let [x, y] of sides)
            context.lineTo(
                centerX + radius * (x * dx - y * dy),
                centerY + radius * (y * dx + x * dy)
            );
    } else {
        if ("string" === typeof sides) {
            let path = new Path2D(sides);
            context.save();
            context.translate(centerX, centerY);
            context.scale(radius, radius);
            context.lineWidth /= radius;
            context.rotate(angle);
            context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width
            if (!borderless) context.stroke(path);
            if (fill) context.fill(path);
            context.restore();
            return;
        }
        angle += sides % 2 ? 0 : Math.PI / sides;
    }
    if (!sides) {
        // Circle
        let fillcolor = context.fillStyle;
        let strokecolor = context.strokeStyle;
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.fillStyle = strokecolor;
        context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width
        if (!borderless) context.stroke();
        context.closePath();
        context.beginPath();
        context.fillStyle = fillcolor;
        context.arc(centerX, centerY, radius * fill, 0, 2 * Math.PI);
        if (fill) context.fill();
        context.closePath();
        return;
    } else if (sides < 0) {
        // Star
        if (config.graphical.pointy) context.lineJoin = "miter";
        sides = -sides;
        angle += (sides % 1) * Math.PI * 2;
        sides = Math.floor(sides);
        let dip = 1 - 6 / (sides ** 2);
        context.moveTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
        context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width
        for (let i = 0; i < sides; i++) {
            let htheta = ((i + 0.5) / sides) * 2 * Math.PI + angle,
                theta = ((i + 1) / sides) * 2 * Math.PI + angle,
                cx = centerX + radius * dip * Math.cos(htheta),
                cy = centerY + radius * dip * Math.sin(htheta),
                px = centerX + radius * Math.cos(theta),
                py = centerY + radius * Math.sin(theta);
            /*if (curvyTraps) {
                context.quadraticCurveTo(cx, cy, px, py);
            } else {
                context.lineTo(cx, cy);
                context.lineTo(px, py);
            }*/
            context.quadraticCurveTo(cx, cy, px, py);
        }
    } else if (sides > 0) {
        // Polygon
        angle += (sides % 1) * Math.PI * 2;
        sides = Math.floor(sides);
        context.lineWidth *= fill ? 1 : 0.5; // Maintain constant border width
        for (let i = 0; i < sides; i++) {
            let theta = (i / sides) * 2 * Math.PI + angle;
            context.lineTo(centerX + radius * Math.cos(theta), centerY + radius * Math.sin(theta));
        }
    }
    context.closePath();
    if (!borderless) context.stroke();
    if (fill) context.fill();
    context.lineJoin = "round";
}
function drawTrapezoid(context, x, y, length, height, aspect, angle, borderless, fill) {
    let h = [];
    h = aspect > 0 ? [height * aspect, height] : [height, -height * aspect];
    let r = [Math.atan2(h[0], length), Math.atan2(h[1], length)];
    let l = [Math.sqrt(length ** 2 + h[0] ** 2), Math.sqrt(length ** 2 + h[1] ** 2)];
    context.beginPath();
    context.lineTo(x + l[0] * Math.cos(angle +           r[0]), y + l[0] * Math.sin(angle           + r[0]));
    context.lineTo(x + l[1] * Math.cos(angle + Math.PI - r[1]), y + l[1] * Math.sin(angle + Math.PI - r[1]));
    context.lineTo(x + l[1] * Math.cos(angle + Math.PI + r[1]), y + l[1] * Math.sin(angle + Math.PI + r[1]));
    context.lineTo(x + l[0] * Math.cos(angle           - r[0]), y + l[0] * Math.sin(angle           - r[0]));
    context.closePath();
    if (!borderless) context.stroke();
    if (fill) context.fill();
}

export {
    drawPoly,
    drawTrapezoid
}