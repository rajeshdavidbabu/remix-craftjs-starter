import type { Node, Nodes } from '@craftjs/core';

let imports: { displayName: string; importPath: string }[] = [];

const generateComponentCode = (
  nodesMap: Nodes,
  nodeId: string,
  level: number
): string => {
  const node = nodesMap[nodeId];
  const { displayName, props, nodes, linkedNodes, custom } = node.data;

  const indendation = getIndentation(level);
  const openingTag = `<${displayName}${generatePropsString(props)}>`;
  const closingTag = `</${displayName}>`;

  console.log(' custom ', displayName, custom);

  if (!imports.find((item) => item.displayName === displayName)) {
    imports.push({
      displayName,
      importPath: custom.importPath,
    });
  }

  if (nodes.length === 0 && Object.keys(linkedNodes).length === 0) {
    // No child nodes, return the self-closing tag
    return `${indendation}${openingTag}${generateChildString(
      props.children,
      level + 1
    )}${closingTag}`;
  } else {
    // Has child nodes, recursively generate code for children
    const childComponents = nodes.map((childId) =>
      generateComponentCode(nodesMap, childId, level + 1)
    );

    const childComponentsString = childComponents.length
      ? `\n${childComponents.join(`\n`)}`
      : '';

    const linkedChildComponents = Object.entries(linkedNodes).map(
      ([key, value]) => generateComponentCode(nodesMap, value, level + 1)
    );

    const linkedChildComponentsString = linkedChildComponents.length
      ? `\n${linkedChildComponents.join(`\n`)}`
      : '';

    return `${indendation}${openingTag}${childComponentsString}${linkedChildComponentsString}\n${indendation}${closingTag}`;
  }
};

interface ComponentInfo {
  displayName: string;
  importPath: string;
}

const generateImportStatements = (components: ComponentInfo[]): string => {
  const filteredComponents = components.filter(
    (comp) => comp.displayName !== 'div'
  );

  const groupedComponents: { [key: string]: ComponentInfo[] } = {};

  // Group components by import path
  filteredComponents.forEach((comp) => {
    const key = comp.importPath || ''; // Use an empty string for components without a path
    if (!groupedComponents[key]) {
      groupedComponents[key] = [];
    }
    groupedComponents[key].push(comp);
  });

  // Generate import statements
  const importStatements = Object.values(groupedComponents).map((group) => {
    const displayNameList = group.map((comp) => comp.displayName).join(', ');
    const importPath = group[0].importPath
      ? ` from "${group[0].importPath}"`
      : '';
    return `import { ${displayNameList} }${importPath};`;
  });

  return importStatements.join('\n');
};

function wrapInsideComponent(input: string): string {
  return `
export function Component() {
  return (
    ${input.trim().replace(/^/gm, '  ')}
  );
}
  `.trim();
}

const generatePropsString = (props: {
  [key: string]: string | undefined;
}): string => {
  const propsArray = Object.entries(props)
    .filter(([key]) => key !== 'children') // Exclude children from props
    .map(([key, value]) => `${key}="${value}"`);
  return propsArray.length > 0 ? ` ${propsArray.join(' ')}` : '';
};

const getIndentation = (level: number): string => {
  if (!level) {
    return '';
  }
  return ' '.repeat(level * 2); // Adjust the number of spaces per level as needed
};

const generateChildString = (
  children: string | Node[] | undefined,
  level: number
): string => {
  if (typeof children === 'string') {
    // If children is a string, return it directly
    return children;
  } else if (Array.isArray(children) && children.length > 0) {
    return children
      .map((child) => generateComponentCode({ TEMP: child }, 'TEMP', level))
      .join('');
  } else {
    return '';
  }
};

export const getOutputCode = (nodes: Nodes) => {
  imports = [];

  const componentString = generateComponentCode(nodes, 'ROOT', 2);
  const importString = generateImportStatements(imports);
  const output = wrapInsideComponent(componentString);
  console.log(generateImportStatements(imports));
  console.log('imports ', imports);

  return { importString, output };
};

export const getOutputHTMLFromId = (iframeId: string): string => {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
  const iframeDocument = iframe?.contentWindow?.document || null;

  if (iframeDocument) {
    const indentation = '  '; // Adjust the indentation as needed
    const iframeHtml = iframeDocument.documentElement.outerHTML;
    const indentedHtml = iframeHtml.replace(/^(.*)$/gm, indentation + '$1');

    return indentedHtml;
  } else {
    alert('Failed to access iframe content.');
    return '';
  }
};
