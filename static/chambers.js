(function () {
  "use strict";

  var coneColors = [
    "#488ac2",
    "#db5e57",
    "#63ab6b",
    "#dfa03d",
    "#8e69b5",
    "#2f7f7f",
    "#c06c84",
    "#7a9e3a",
    "#c47f2c",
    "#5b6ec7"
  ];

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function cross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  }

  function add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function scale(a, t) {
    return [a[0] * t, a[1] * t, a[2] * t];
  }

  function norm(a) {
    return Math.sqrt(dot(a, a));
  }

  function normalize(a) {
    var length = norm(a);
    return a.map(function (entry) {
      return entry / length;
    });
  }

  function centeredNormal(rays, provided) {
    // The slicing normal stored in the data is an arbitrary interior vector of
    // the dual cone (Macaulay2's `interiorVector`), which may sit close to the
    // cone's boundary and produce a badly stretched cross-section (a ray nearly
    // parallel to the plane flies off toward infinity). Re-center it toward the
    // direction that maximizes the smallest angle-cosine with every ray, i.e.
    // the most balanced viewing plane. This is still a genuine planar slice, so
    // every wall stays straight and all collinearities are preserved; we only
    // pick a better plane. Projected subgradient ascent on the (concave)
    // minimum-cosine, seeded from the provided normal so the result is never
    // less centered than what the data supplied.
    var unitRays = rays.map(normalize);
    function minDot(candidate) {
      return unitRays.reduce(function (least, u) {
        return Math.min(least, dot(candidate, u));
      }, Infinity);
    }
    var current = normalize(provided);
    var best = current;
    var bestMin = minDot(current);
    for (var k = 0; k < 300; k += 1) {
      var worst = unitRays[0];
      var worstDot = dot(current, worst);
      for (var i = 1; i < unitRays.length; i += 1) {
        var value = dot(current, unitRays[i]);
        if (value < worstDot) {
          worstDot = value;
          worst = unitRays[i];
        }
      }
      current = normalize(add(current, scale(worst, 1 / (k + 2))));
      var candidateMin = minDot(current);
      if (candidateMin > bestMin) {
        bestMin = candidateMin;
        best = current;
      }
    }
    return best;
  }

  function choosePlaneRotation(deltas, planeX, planeY, scale2d, labels) {
    // The in-plane orientation of a slice is arbitrary, so we are free to spin
    // it about the slicing axis. Pick the rotation that keeps the ray labels
    // from colliding, preferring the smallest rotation that does so. Label box
    // geometry below must match the values used when rendering text.
    var labelOffsetX = 4;
    var labelOffsetY = 4;
    var labelFontSize = 8;
    var labelCharWidth = 5;
    var pointRadius = 2.3;

    function boxesFor(cosPhi, sinPhi) {
      var rotatedX = add(scale(planeX, cosPhi), scale(planeY, sinPhi));
      var rotatedY = add(scale(planeX, -sinPhi), scale(planeY, cosPhi));
      return deltas.map(function (delta, index) {
        var px = dot(delta, rotatedX) * scale2d;
        var py = -dot(delta, rotatedY) * scale2d;
        var labelWidth = labels[index].length * labelCharWidth;
        return {
          label: [px + labelOffsetX, py - labelOffsetY - labelFontSize, px + labelOffsetX + labelWidth, py - labelOffsetY],
          point: [px - pointRadius, py - pointRadius, px + pointRadius, py + pointRadius],
        };
      });
    }

    function overlapArea(a, b) {
      var width = Math.min(a[2], b[2]) - Math.max(a[0], b[0]);
      var height = Math.min(a[3], b[3]) - Math.max(a[1], b[1]);
      return width > 0 && height > 0 ? width * height : 0;
    }

    function scoreFor(angle) {
      var boxes = boxesFor(Math.cos(angle), Math.sin(angle));
      var total = 0;
      var i;
      var j;
      for (i = 0; i < boxes.length; i += 1) {
        for (j = 0; j < boxes.length; j += 1) {
          if (i < j) {
            total += overlapArea(boxes[i].label, boxes[j].label);
          }
          if (i !== j) {
            total += overlapArea(boxes[i].label, boxes[j].point);
          }
        }
      }
      return total;
    }

    // Candidates ordered by increasing magnitude so that ties resolve to the
    // gentlest rotation; the strict comparison below keeps the first best.
    var candidates = [0];
    var step;
    for (step = 6; step <= 180; step += 6) {
      candidates.push(step, -step);
    }
    var bestAngle = 0;
    var bestScore = Infinity;
    candidates.forEach(function (degrees) {
      var score = scoreFor(degrees * Math.PI / 180);
      if (score < bestScore - 1e-6) {
        bestScore = score;
        bestAngle = degrees;
      }
    });

    var phi = bestAngle * Math.PI / 180;
    return {
      x: add(scale(planeX, Math.cos(phi)), scale(planeY, Math.sin(phi))),
      y: add(scale(planeX, -Math.sin(phi)), scale(planeY, Math.cos(phi))),
    };
  }

  function planeCoordinates(point, origin, basisX, basisY) {
    var delta = subtract(point, origin);
    return [dot(delta, basisX), dot(delta, basisY)];
  }

  function clipPolygonWithHalfPlane(polygon, inequality) {
    var result = [];
    var epsilon = 1e-9;
    var i;

    for (i = 0; i < polygon.length; i += 1) {
      var current = polygon[i];
      var next = polygon[(i + 1) % polygon.length];
      var currentValue = inequality.a * current[0] + inequality.b * current[1] + inequality.c;
      var nextValue = inequality.a * next[0] + inequality.b * next[1] + inequality.c;
      var currentInside = currentValue >= -epsilon;
      var nextInside = nextValue >= -epsilon;

      if (currentInside && nextInside) {
        result.push(next);
      } else if (currentInside && !nextInside) {
        var t1 = currentValue / (currentValue - nextValue);
        result.push([
          current[0] + t1 * (next[0] - current[0]),
          current[1] + t1 * (next[1] - current[1]),
        ]);
      } else if (!currentInside && nextInside) {
        var t2 = currentValue / (currentValue - nextValue);
        result.push([
          current[0] + t2 * (next[0] - current[0]),
          current[1] + t2 * (next[1] - current[1]),
        ]);
        result.push(next);
      }
    }

    return result;
  }

  function sortVerticesInPlane(vertices, planeNormal) {
    var center = vertices.reduce(function (sum, point) {
      return add(sum, point);
    }, [0, 0, 0]).map(function (entry) {
      return entry / vertices.length;
    });
    var localX = normalize(subtract(vertices[0], center));
    var localY = normalize(cross(planeNormal, localX));

    return vertices.slice().sort(function (a, b) {
      var da = subtract(a, center);
      var db = subtract(b, center);
      var angleA = Math.atan2(dot(da, localY), dot(da, localX));
      var angleB = Math.atan2(dot(db, localY), dot(db, localX));
      return angleA - angleB;
    });
  }

  function coneSlicePolygon(indices, rays, planePoint, planeNormal, basisX, basisY, clipRadius) {
    var coneRays = indices.map(function (index) {
      return rays[index];
    });
    var inequalities = [];
    var i;

    for (i = 0; i < coneRays.length; i += 1) {
      var a = coneRays[i];
      var b = coneRays[(i + 1) % coneRays.length];
      var c = coneRays[(i + 2) % coneRays.length];
      var normal = cross(a, b);

      if (norm(normal) < 1e-9) {
        continue;
      }

      if (dot(normal, c) < 0) {
        normal = scale(normal, -1);
      }

      inequalities.push({
        a: dot(normal, basisX),
        b: dot(normal, basisY),
        c: dot(normal, planePoint),
      });
    }

    var polygon = [
      [-clipRadius, -clipRadius],
      [clipRadius, -clipRadius],
      [clipRadius, clipRadius],
      [-clipRadius, clipRadius],
    ];

    inequalities.forEach(function (inequality) {
      polygon = clipPolygonWithHalfPlane(polygon, inequality);
    });

    return polygon.map(function (coords) {
      return add(planePoint, add(scale(basisX, coords[0]), scale(basisY, coords[1])));
    });
  }

  function intersectRayWithPlane(direction, planePoint, planeNormal) {
    var denominator = dot(planeNormal, direction);
    if (Math.abs(denominator) < 1e-9) {
      return null;
    }

    var factor = dot(planeNormal, planePoint) / denominator;
    if (factor <= 0) {
      return null;
    }

    return scale(direction, factor);
  }

  function formatRay(ray) {
    return "[" + ray.join(",") + "]";
  }

  function validateRays(rays, cones) {
    if (!Array.isArray(rays) || rays.length === 0) {
      throw new Error("Rays must be a nonempty array.");
    }

    var dimension = Array.isArray(rays[0]) ? rays[0].length : 0;
    if (dimension !== 1 && dimension !== 2 && dimension !== 3) {
      throw new Error(cones.length + " chambers");
    }

    if (!rays.every(function (ray) {
      return Array.isArray(ray) && ray.length === dimension && ray.every(Number.isFinite);
    })) {
      throw new Error("All rays must have the same dimension.");
    }
  }

  function validateCones(cones, rayCount) {
    if (!Array.isArray(cones) || !cones.every(function (cone) {
      return Array.isArray(cone) &&
        cone.every(function (index) {
          return Number.isInteger(index) && index >= 0 && index < rayCount;
        });
    })) {
      throw new Error("Invalid cone data.");
    }
  }

  function parseChambers(text) {
    var jsonish = text.replace(/\{/g, "[").replace(/\}/g, "]").replace(/\(/g, "[").replace(/\)/g, "]");
    var parsed = JSON.parse(jsonish);
    if (Number.isInteger(parsed)) {
      return {
        count: parsed,
      };
    }
    if (!Array.isArray(parsed) || parsed.length !== 3) {
      throw new Error("Chambers data must have the form (rays, cones, vector).");
    }
    return {
      rays: parsed[0],
      cones: parsed[1],
      normal: parsed[2],
    };
  }

  function wallCountFromFirstCone(cones, fanDimension) {
    if (!Array.isArray(cones) || cones.length === 0) {
      return 0;
    }

    var firstCone = cones[0];
    var firstConeEntries = new Set(firstCone);

    return cones.slice(1).filter(function (cone) {
      if (!Array.isArray(cone)) {
        return false;
      }

      var shared = cone.filter(function (entry) {
        return firstConeEntries.has(entry);
      }).length;

      return shared === fanDimension - 1;
    }).length;
  }

  function renderIntoCell(cell, payload) {
    var rays = payload.rays;
    var maximalCones = payload.cones;
    var normalVector = payload.normal;
    var dimension = rays[0].length;
    var polygons;
    var labeledPoints;
    var allPlanePoints;
    var toPlaneCoords;
    var slicingPoint = [1, 1, 1];

    if (dimension === 1) {
      cell.innerHTML = [
        '<svg class="fan-svg" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg" aria-label="Fan">',
        '<line x1="10" y1="22" x2="90" y2="22" stroke="#111" stroke-width="1.5" />',
        '<circle cx="10" cy="22" r="2.3" fill="#111" />',
        '<circle cx="90" cy="22" r="2.3" fill="#111" />',
        '<text x="7" y="14" font-size="8" fill="#111">[0]</text>',
        '<text x="87" y="14" font-size="8" fill="#111">[1]</text>',
        "</svg>"
      ].join("");
      return;
    }

    if (dimension === 2) {
      polygons = maximalCones.map(function (cone) {
        var vertices = [[0, 0, 0]].concat(cone.map(function (index) {
          return [rays[index][0], rays[index][1], 0];
        }));
        return sortVerticesInPlane(vertices, [0, 0, 1]);
      });

      labeledPoints = rays.map(function (ray) {
        return { ray: ray, point: [ray[0], ray[1], 0] };
      });

      allPlanePoints = [[0, 0]].concat(polygons.flat().map(function (point) {
        return [point[0], point[1]];
      }), labeledPoints.map(function (entry) {
        return [entry.point[0], entry.point[1]];
      }));

      toPlaneCoords = function (point) {
        return [point[0], point[1]];
      };
    } else {
      var slicingNormal = centeredNormal(rays, normalVector);
      // Anchor the cutting plane one unit along the (re-centered) normal, so
      // every ray with a positive dot product meets it on the correct side.
      slicingPoint = slicingNormal;
      var seed = Math.abs(slicingNormal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      var planeX = normalize(cross(slicingNormal, seed));
      var planeY = normalize(cross(slicingNormal, planeX));
      labeledPoints = rays.map(function (ray) {
        return { ray: ray, point: intersectRayWithPlane(ray, slicingPoint, slicingNormal) };
      }).filter(function (entry) {
        return entry.point !== null;
      });

      // Spin the slice in its own plane to keep the ray labels from colliding.
      var planeDeltas = labeledPoints.map(function (entry) {
        return subtract(entry.point, slicingPoint);
      });
      var invariantExtent = Math.max.apply(null, [1].concat(planeDeltas.map(function (delta) {
        return Math.sqrt(Math.pow(dot(delta, planeX), 2) + Math.pow(dot(delta, planeY), 2));
      })));
      var rotatedBasis = choosePlaneRotation(
        planeDeltas, planeX, planeY, 80 / invariantExtent,
        labeledPoints.map(function (entry) { return formatRay(entry.ray); })
      );
      planeX = rotatedBasis.x;
      planeY = rotatedBasis.y;

      var preliminaryPoints = labeledPoints.map(function (entry) {
        return planeCoordinates(entry.point, slicingPoint, planeX, planeY);
      });
      var preliminaryExtent = Math.max.apply(null, [1].concat(preliminaryPoints.map(function (point) {
        return Math.max(Math.abs(point[0]), Math.abs(point[1]));
      })));
      var clipRadius = 2 * preliminaryExtent + 1;
      polygons = maximalCones.map(function (cone) {
        return sortVerticesInPlane(
          coneSlicePolygon(cone, rays, slicingPoint, slicingNormal, planeX, planeY, clipRadius),
          slicingNormal
        );
      });

      allPlanePoints = polygons.flat().map(function (point) {
        return planeCoordinates(point, slicingPoint, planeX, planeY);
      }).concat(labeledPoints.map(function (entry) {
        return planeCoordinates(entry.point, slicingPoint, planeX, planeY);
      }));

      toPlaneCoords = function (point) {
        return planeCoordinates(point, slicingPoint, planeX, planeY);
      };
    }

    var minX = Math.min.apply(null, allPlanePoints.map(function (point) { return point[0]; }));
    var maxX = Math.max.apply(null, allPlanePoints.map(function (point) { return point[0]; }));
    var minY = Math.min.apply(null, allPlanePoints.map(function (point) { return point[1]; }));
    var maxY = Math.max.apply(null, allPlanePoints.map(function (point) { return point[1]; }));
    var maxRayNorm = Math.max.apply(null, [1].concat(labeledPoints.map(function (entry) {
      var point = toPlaneCoords(entry.point);
      return Math.sqrt(point[0] * point[0] + point[1] * point[1]);
    })));
    var scale2d = 80 / maxRayNorm;
    var pointRadius = 2.3;
    var labelOffsetX = 4;
    var labelOffsetY = 4;
    var labelFontSize = 8;
    var labelCharWidth = 5;
    var padding = 10;
    var minXPx = minX * scale2d;
    var maxXPx = maxX * scale2d;
    var minYPx = -maxY * scale2d;
    var maxYPx = -minY * scale2d;

    labeledPoints.forEach(function (entry) {
      var point = toPlaneCoords(entry.point);
      var px = point[0] * scale2d;
      var py = -point[1] * scale2d;
      var labelWidth = formatRay(entry.ray).length * labelCharWidth;

      minXPx = Math.min(minXPx, px - pointRadius);
      maxXPx = Math.max(maxXPx, px + pointRadius, px + labelOffsetX + labelWidth);
      minYPx = Math.min(minYPx, py - pointRadius, py - labelOffsetY - labelFontSize);
      maxYPx = Math.max(maxYPx, py + pointRadius);
    });

    var widthPx = Math.max(30, maxXPx - minXPx + 2 * padding);
    var heightPx = Math.max(30, maxYPx - minYPx + 2 * padding);
    var shiftX = padding - minXPx;
    var shiftY = padding - minYPx;

    function toSvg(point3d) {
      var point = toPlaneCoords(point3d);
      return {
        x: point[0] * scale2d + shiftX,
        y: -point[1] * scale2d + shiftY,
      };
    }

    function polygonPoints(vertices) {
      return vertices.map(function (point) {
        var svgPoint = toSvg(point);
        return svgPoint.x + "," + svgPoint.y;
      }).join(" ");
    }

    var svgParts = [];
    svgParts.push('<svg class="fan-svg" viewBox="0 0 ' + widthPx + " " + heightPx + '" xmlns="http://www.w3.org/2000/svg" aria-label="Fan">');

    polygons.forEach(function (polygon, index) {
      var color = coneColors[index % coneColors.length];
      svgParts.push('<polygon points="' + polygonPoints(polygon) + '" fill="' + color + '" fill-opacity="0.35" stroke="' + color + '" stroke-width="1.5" />');
    });

    if (dimension === 2) {
      var origin = toSvg([0, 0, 0]);
      labeledPoints.forEach(function (entry) {
        var endpoint = toSvg(entry.point);
        svgParts.push('<line x1="' + origin.x + '" y1="' + origin.y + '" x2="' + endpoint.x + '" y2="' + endpoint.y + '" stroke="#111" stroke-width="1.5" />');
      });
      svgParts.push('<circle cx="' + origin.x + '" cy="' + origin.y + '" r="2.8" fill="#111" />');
    }

    labeledPoints.forEach(function (entry) {
      var svgPoint = toSvg(entry.point);
      svgParts.push('<circle cx="' + svgPoint.x + '" cy="' + svgPoint.y + '" r="' + pointRadius + '" fill="#111" />');
      svgParts.push('<text x="' + (svgPoint.x + labelOffsetX) + '" y="' + (svgPoint.y - labelOffsetY) + '" font-size="' + labelFontSize + '" fill="#111">' + formatRay(entry.ray) + "</text>");
    });

    svgParts.push("</svg>");
    cell.innerHTML = svgParts.join("");
  }

  function initChambers(root, element) {
    var cells = (root || document).querySelectorAll("td." + element + "[data-fan]");
    cells.forEach(function (cell) {
      try {
        var payload = parseChambers(cell.getAttribute("data-fan"));
        if (Number.isInteger(payload.count)) {
          cell.textContent = payload.count + " chambers";
          return;
        }
        if (element === "Fan" && Array.isArray(payload.rays) && Array.isArray(payload.rays[0]) && payload.rays[0].length > 2) {
          cell.textContent = payload.cones.length + " cones";
          return;
        }
        if (element === "Chambers" && Array.isArray(payload.rays) && Array.isArray(payload.rays[0]) && payload.rays[0].length >= 4) {
          cell.innerHTML = payload.cones.length + " chambers,<br/>" + wallCountFromFirstCone(payload.cones, payload.rays[0].length) + " walls";
          return;
        }
        validateRays(payload.rays, payload.cones);
        validateCones(payload.cones, payload.rays.length);
        if (payload.rays[0].length === 3 &&
            (!Array.isArray(payload.normal) || payload.normal.length !== 3 || !payload.normal.every(Number.isFinite) || norm(payload.normal) < 1e-9)) {
          throw new Error("Normal vector must be a nonzero 3-vector.");
        }
        renderIntoCell(cell, payload);
      } catch (error) {
        cell.textContent = error.message;
      }
    });
  }

  window.initChambers = initChambers;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initChambers(document, "Fan");
      initChambers(document, "Chambers");
    });
  } else {
    initChambers(document, "Fan");
    initChambers(document, "Chambers");
  }
}());
