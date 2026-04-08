(function () {
  "use strict";

  var coneColors = ["#db5e57", "#488ac2", "#63ab6b", "#dfa03d", "#8e69b5"];

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

  function orthonormalBasis(normal) {
    var seed = Math.abs(normal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    var first = normalize(cross(normal, seed));
    var second = normalize(cross(normal, first));
    return [first, second];
  }

  function pointFromPlaneCoordinates(coords, origin, basisX, basisY) {
    return add(origin, add(scale(basisX, coords[0]), scale(basisY, coords[1])));
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
      return pointFromPlaneCoordinates(coords, planePoint, basisX, basisY);
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

  function validateNormal(normal) {
    if (!Array.isArray(normal) || normal.length !== 3 || !normal.every(Number.isFinite) || norm(normal) < 1e-9) {
      throw new Error("Normal vector must be a nonzero 3-vector.");
    }
  }

  function parseChambers(text) {
    var jsonish = text.replace(/\{/g, "[").replace(/\}/g, "]").replace(/\(/g, "[").replace(/\)/g, "]");
    var parsed = JSON.parse(jsonish);
    if (!Array.isArray(parsed) || parsed.length !== 3) {
      throw new Error("Chambers data must have the form (rays, cones, vector).");
    }
    return {
      rays: parsed[0],
      cones: parsed[1],
      normal: parsed[2],
    };
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
        '<svg class="chambers-svg" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg" aria-label="Chambers">',
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
      var slicingNormal = normalize(normalVector);
      var basis = orthonormalBasis(slicingNormal);
      var planeX = basis[0];
      var planeY = basis[1];
      labeledPoints = rays.map(function (ray) {
        return { ray: ray, point: intersectRayWithPlane(ray, slicingPoint, slicingNormal) };
      }).filter(function (entry) {
        return entry.point !== null;
      });
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
    svgParts.push('<svg class="chambers-svg" viewBox="0 0 ' + widthPx + " " + heightPx + '" xmlns="http://www.w3.org/2000/svg" aria-label="Chambers">');

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

  function initChambers(root) {
    var cells = (root || document).querySelectorAll("td.Chambers[data-chambers]");
    cells.forEach(function (cell) {
      try {
        var payload = parseChambers(cell.getAttribute("data-chambers"));
        validateRays(payload.rays, payload.cones);
        validateCones(payload.cones, payload.rays.length);
        if (payload.rays[0].length === 3) {
          validateNormal(payload.normal);
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
      initChambers(document);
    });
  } else {
    initChambers(document);
  }
}());
