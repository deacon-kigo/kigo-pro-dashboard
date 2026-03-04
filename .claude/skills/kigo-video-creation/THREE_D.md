# 3D Component Guide

All 3D components live in `remotion/components/three/` and are exported from `remotion/components/three/index.ts`.

Import pattern:

```typescript
import {
  StudioScene,
  DeviceMockup3D,
  FloatingCard3D,
  Text3DHeading,
  ReflectiveFloor,
} from "../three";
```

## Critical Rules

1. **Always use `<ThreeCanvas>` from `@remotion/three`** -- never use `<Canvas>` from `@react-three/fiber` directly. `StudioScene` handles this for you.
2. **Always use `layout="none"` on `<Sequence>` elements** inside ThreeCanvas. Without this, Remotion will try to apply CSS layout which breaks the 3D context.
3. **Never use R3F's `useFrame()`** -- all animation must use Remotion's `useCurrentFrame()`, `interpolate()`, and `spring()`.
4. **Render with `--gl=angle`** -- this is already set in `remotion.config.ts` via `Config.setChromiumOpenGlRenderer("angle")`, but explicitly pass it for CLI renders: `npm run video:render -- CompositionId out/file.mp4 --gl=angle`
5. **3D scenes are heavier** -- keep particle counts low, avoid high-poly geometry, test in Remotion Studio before rendering.

---

## StudioScene

**File**: `remotion/components/three/StudioScene.tsx`
**Role**: Required wrapper for all 3D content. Provides ThreeCanvas, camera, lighting, and environment.

### Props

| Prop                | Type                       | Default            | Description                                 |
| ------------------- | -------------------------- | ------------------ | ------------------------------------------- |
| `children`          | `React.ReactNode`          | required           | 3D content (meshes, groups, etc.)           |
| `startFrame`        | `number`                   | `0`                | Frame offset for entrance                   |
| `cameraPosition`    | `[number, number, number]` | `[0, 1.5, 6]`      | Initial camera position                     |
| `cameraTarget`      | `[number, number, number]` | `[0, 0, 0]`        | Camera look-at target                       |
| `cameraOrbit`       | `boolean`                  | `false`            | Enable orbital camera rotation              |
| `orbitRadius`       | `number`                   | auto (XZ distance) | Orbit radius if orbiting                    |
| `orbitSpeed`        | `number`                   | `1`                | Orbit speed (full rotations per 300f / 10s) |
| `environmentPreset` | `string`                   | `"studio"`         | drei Environment preset for reflections/IBL |

### Internals

- Creates `<ThreeCanvas>` at full video dimensions (1920x1080)
- `PerspectiveCamera` with 50 FOV, 0.1 near, 100 far
- Three lights: ambient (0.4), main directional (intensity 1, shadow-casting, position [5,8,5]), fill directional (0.3, position [-3,4,-4])
- Environment map via drei `<Environment>` for reflections
- Children wrapped in `<Sequence from={startFrame} layout="none">`

### Camera Orbit

When `cameraOrbit={true}`, the camera circles the origin in the XZ plane. Y position stays fixed from `cameraPosition[1]`. One full orbit takes 300 frames (10 seconds) at `orbitSpeed=1`.

### Usage

```tsx
<StudioScene cameraPosition={[0, 2, 8]} cameraOrbit>
  <DeviceMockup3D type="laptop" screenContent="/screenshots/dashboard.png" />
  <ReflectiveFloor />
</StudioScene>
```

---

## DeviceMockup3D

**File**: `remotion/components/three/DeviceMockup3D.tsx`
**Role**: 3D laptop or phone that rotates to reveal a screenshot on its screen.

### Props

| Prop            | Type                       | Default           | Description                    |
| --------------- | -------------------------- | ----------------- | ------------------------------ |
| `type`          | `"laptop" \| "phone"`      | `"laptop"`        | Device type                    |
| `screenContent` | `string`                   | required          | URL/path to screenshot texture |
| `startFrame`    | `number`                   | `0`               | Frame offset                   |
| `rotateFrom`    | `[number, number, number]` | `[0, PI*0.25, 0]` | Initial rotation (radians)     |
| `rotateTo`      | `[number, number, number]` | `[0, 0, 0]`       | Target rotation (radians)      |

### Device Dimensions

| Type   | Width | Height | Depth | Screen Inset | Tilt X    |
| ------ | ----- | ------ | ----- | ------------ | --------- |
| laptop | 4.0   | 2.6    | 0.15  | 0.15         | -0.15 rad |
| phone  | 1.4   | 2.8    | 0.12  | 0.10         | 0         |

### Animation Behavior

- Rotation: spring-driven interpolation from `rotateFrom` to `rotateTo` using `springs.smooth`
- Scale: springs from 0 to 1 using `springs.snappy`
- Body: `RoundedBox` with charcoal color, 0.6 metalness, 0.3 roughness
- Screen: `Plane` geometry with texture loaded via drei `useTexture()`

### Screenshot Preparation

Place screenshot images in `public/` and reference with `staticFile()`:

```typescript
import { staticFile } from "remotion";
<DeviceMockup3D screenContent={staticFile("screenshots/dashboard.png")} />
```

Screenshots should match the device aspect ratio:

- Laptop: 16:10 (e.g., 1920x1200 or 3840x2400)
- Phone: 1:2 (e.g., 1080x2160)

---

## FloatingCard3D

**File**: `remotion/components/three/FloatingCard3D.tsx`
**Role**: A premium card floating in 3D space with gentle sinusoidal motion.

### Props

| Prop         | Type     | Default        | Description               |
| ------------ | -------- | -------------- | ------------------------- |
| `color`      | `string` | `colors.white` | Card face color           |
| `startFrame` | `number` | `0`            | Frame offset              |
| `width`      | `number` | `3`            | Card width (world units)  |
| `height`     | `number` | `2`            | Card height (world units) |

### Animation Behavior

- Entrance: spring scale from 0 to 1 (`springs.smooth`)
- Continuous motion:
  - Y rotation: `sin(frame * 0.03) * 0.12` rad
  - Y float: `sin(frame * 0.04) * 0.08` world units
  - X tilt: `sin(frame * 0.025) * 0.04` rad
- Geometry: `RoundedBox` at 0.04 depth, 0.08 radius
- Material: `MeshPhysicalMaterial` with clearcoat (0.4), reflectivity (0.5)

### Usage

Use inside `StudioScene`. Position multiple cards with `<group position={[x,y,z]}>`:

```tsx
<StudioScene>
  <group position={[-2, 0, 0]}>
    <FloatingCard3D color={colors.blue} width={2} height={1.5} />
  </group>
  <group position={[2, 0.5, -1]}>
    <FloatingCard3D
      color={colors.purple}
      width={2}
      height={1.5}
      startFrame={10}
    />
  </group>
</StudioScene>
```

---

## Text3DHeading

**File**: `remotion/components/three/Text3DHeading.tsx`
**Role**: Metallic 3D text with spring entrance and subtle continuous rotation.

### Props

| Prop         | Type     | Default        | Description             |
| ------------ | -------- | -------------- | ----------------------- |
| `text`       | `string` | required       | Text to render          |
| `color`      | `string` | `colors.white` | Text color              |
| `startFrame` | `number` | `0`            | Frame offset            |
| `size`       | `number` | `1`            | Font size (world units) |

### Animation Behavior

- Entrance: spring scale from 0 to 1 (`springs.snappy`)
- Continuous motion:
  - Y rotation: `sin(frame * 0.02) * 0.08` rad
  - X nod: `sin(frame * 0.015) * 0.03` rad
- Uses drei `<Text>` (troika-based, no font file needed)
- Material: `MeshStandardMaterial` with 0.8 metalness, 0.2 roughness
- Outline: `outlineWidth = size * 0.04`, black outline for depth
- Centered: `anchorX="center"` `anchorY="middle"`, max width 10 units

### Usage

```tsx
<StudioScene>
  <Text3DHeading text="Kigo" size={1.5} color={colors.coral} />
</StudioScene>
```

---

## ReflectiveFloor

**File**: `remotion/components/three/ReflectiveFloor.tsx`
**Role**: Polished reflective stage floor for Apple-keynote-style presentations.

### Props

| Prop      | Type               | Default        | Description               |
| --------- | ------------------ | -------------- | ------------------------- |
| `color`   | `string`           | `colors.black` | Floor tint                |
| `blur`    | `[number, number]` | `[300, 100]`   | Reflection blur [x, y]    |
| `mixBlur` | `number`           | `0.75`         | Blur mix amount (0-1)     |
| `mirror`  | `number`           | `0.6`          | Reflection strength (0-1) |

### Details

- Positioned at `y = -0.01`, rotated flat (`-PI/2` on X)
- 50x50 world unit plane geometry
- Uses drei `MeshReflectorMaterial` with 1024 resolution
- Additional properties: mixStrength 0.8, depthScale 1.2, metalness 0.5, roughness 0.7
- Receives shadows

### Usage

Place at the bottom of any `StudioScene` to ground objects:

```tsx
<StudioScene cameraPosition={[0, 2, 6]}>
  <DeviceMockup3D type="laptop" screenContent={staticFile("screen.png")} />
  <ReflectiveFloor />
</StudioScene>
```

---

## Combining 3D Elements: Full Example

```tsx
import { AbsoluteFill, Sequence } from "remotion";
import {
  StudioScene,
  DeviceMockup3D,
  Text3DHeading,
  ReflectiveFloor,
} from "../three";
import { colors } from "../../lib/brand";

const ProductShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <StudioScene cameraPosition={[0, 2, 8]} cameraOrbit orbitSpeed={0.3}>
        {/* 3D heading floating above the device */}
        <group position={[0, 2.5, 0]}>
          <Text3DHeading text="Kigo Dashboard" size={0.8} />
        </group>

        {/* Laptop with screenshot */}
        <group position={[0, 0.5, 0]}>
          <DeviceMockup3D
            type="laptop"
            screenContent={staticFile("screenshots/dashboard.png")}
            startFrame={15}
          />
        </group>

        {/* Reflective stage floor */}
        <ReflectiveFloor mirror={0.5} />
      </StudioScene>
    </AbsoluteFill>
  );
};
```

### Scene Prompt for 3D

When including 3D elements in a scene prompt, specify:

```
- **3D Setup**:
  - Camera: [0, 2, 8], orbit at 0.3x speed
  - Objects:
    - Text3DHeading "Kigo Dashboard" at y=2.5, size=0.8
    - DeviceMockup3D laptop at y=0.5, screen: dashboard.png, startFrame=15
    - ReflectiveFloor mirror=0.5
```
