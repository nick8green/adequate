export const scopedCssVariables = (config) => {
  const { dictionary, platform, file, allTokens } = config;

  const themeScopes = {};
  const brandScopes = {};
  const rootVars = [];

  if (!dictionary || !allTokens) {
    throw new Error('Formatter received undefined dictionary');
  }

  console.log(
    '=================================================================',
  );
  console.log(`Generating scoped CSS variables for file: ${file.destination}`);
  console.log(`Platform: ${platform.transformGroup}`);
  console.log(`Dictionary properties: ${dictionary?.allTokens.length}`);
  console.log(`File path: ${platform.buildPath}`);
  console.log(
    '=================================================================',
  );

  allTokens.forEach((prop) => {
    console.log(
      `Processing token: ${prop.name} (${prop.value}) from ${prop.filePath}`,
    );
    const { filePath, value, name } = prop;
    const cssVar = `  --${name.replace('-light', '')}: ${value};`;

    if (filePath.includes('light.json')) {
      themeScopes.light = themeScopes.light || [];
      themeScopes.light.push(`  --${name.replace('light-', '')}: ${value};`);
    } else if (filePath.includes('dark.json')) {
      themeScopes.dark = themeScopes.dark || [];
      themeScopes.dark.push(`  --${name.replace('dark-', '')}: ${value};`);
    } else if (filePath.includes('/themes/')) {
      // Brand scoping: get folder name (e.g. themes/n8g/theme.json -> "n8g")
      const match = filePath.match(/themes\/([^/]+)\//);
      if (match) {
        const brand = match[1];
        brandScopes[brand] = brandScopes[brand] || [];
        brandScopes[brand].push(`  --${name.replace('brand-', '')}: ${value};`);
      }
    } else {
      rootVars.push(cssVar);
    }
  });

  let output = '';

  if (rootVars.length) {
    output += `:root {\n${rootVars.join('\n')}\n}\n`;
  }

  for (const [theme, vars] of Object.entries(themeScopes)) {
    output += `\n[data-theme="${theme}"] {\n${vars.join('\n')}\n}\n`;
  }

  for (const [brand, vars] of Object.entries(brandScopes)) {
    output += `\n[data-brand="${brand}"] {\n${vars.join('\n')}\n}\n`;
  }

  return output;
};
