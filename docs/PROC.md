# Main Process

A `main.ts` egyből a `control.ts` -t hívja.

A `control.ts` **info** és **save** actionje nem készíti el a TableInfo -t.

-   Lehet hogy ezt kéne előbb megtenni!

A `proc.ts` -ben a **ProcGenerate** a fő generáló függvény, belül a hívott
`GenerateProject` ami már szétágazik `jpa` illetve `ts-model` -re.

```typescript
await JpaGenerateProject(register, options, project, tables, groups);

await TsModelGenerateProject(register, options, project, tables, groups);
```
