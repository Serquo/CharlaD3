import angular from "angular";
import * as d3 from 'd3';
import jsonData from '../index/data';

function IndexController() {
  const vm = this;
  const data = jsonData.DATA;

  const dataParsed = data.graph.map((d) => {
    if (d.address) {
      const district = d.address.district.id;
      const districtName = district.substring(district.lastIndexOf('/') + 1);
      const orgName = d.organization["organization-name"];
      const obj = {
        district: districtName,
        organization: orgName,
        title: d.title,
      }
      return obj;
    }
  }).filter((d) => d !== undefined).sort((a, b) => d3.ascending(a.district, b.district));
  const districts = [];
  dataParsed.forEach((data) => {
    if (districts.length === 0) districts.push({
        name: data.district,
        children: [{organization: data.organization, title: data.title}]
    });
    else {
      const distIndex = districts.findIndex((district) => district.name === data.district);
      if (distIndex === -1) districts.push({
          name: data.district,
          children: [{organization: data.organization, title: data.title}]
        })
      else districts[distIndex].children.push({organization: data.organization, title: data.title});
    }
  });
  const dataStratified = {name: 'Madrid', children: []};
  districts.forEach((district) => {
    const obj = {name: district.name};
    const children = [];
    district.children.forEach((child) => {
      if (children.length === 0) children.push({name: child.organization, children: [{name: child.title}]});
      else {
        const childIndex = children.findIndex((ch) => ch.name === child.organization);
        if (childIndex === -1) children.push({name: child.organization, children: [{name: child.title}]})
        else {
          if (!children[childIndex].children.find((ch) => ch.name === child.title)) children[childIndex].children.push({name: child.title});
        }
      }
    });
    obj.children = children;
    dataStratified.children.push(obj);
  });

  const positiveDistance = 8;
  const negativeDistance = -8;
  const rotationValue1 = 180;
  const rotationValue2 = 90;
  const leftTooltipOffset = 10;
  const topTooltipOffset = -61;

  const width = 1400;
  const height = 930;

  const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const dataResult = d3.hierarchy(dataStratified);

  const diameter = height * 0.8;
  const radius = diameter / 2;

  const tree = d3.tree()
    .size([2 * Math.PI, radius])
    .separation((nodeA, nodeB) => (nodeA.parent === nodeB.parent ? 1 : 2) / nodeA.depth);

  const treeData = tree(dataResult);

  const nodes = treeData.descendants();
  const links = treeData.links();

  const graphGroup = svg.append('g')
    .attr('transform', `translate(${width/2}, ${height/2})`);

  graphGroup.selectAll('.link')
    .data(links)
    .join('path')
    .attr('class', 'link')
    .attr('d', d3.linkRadial()
      .angle(d => d.x)
      .radius(d => d.y))

  const node = graphGroup.selectAll('.node')
    .data(nodes)
    .join('g')
    .attr('class', 'node')
    .attr("transform", (d) => `rotate(${d.x * rotationValue1 / Math.PI - rotationValue2})` + `translate(${d.y}, 0)`);

  node.append('circle').attr('r', 1);

  const tooltipDiv = d3.select('body').append('div')
    .attr('class', 'tooltipGraphDiv')
    .style('opacity', 0);

  node.append('text')
    .attr('font-family', 'sans-serif')
    .attr('dx', (d) => d.x < Math.PI ? positiveDistance : negativeDistance)
    .attr('dy', '.31em')
    .attr('text-anchor', (d) => d.x < Math.PI ? 'start' : 'end')
    .attr("transform", (d) => d.x < Math.PI ? null : "rotate(180)")
    .on('mouseover', (d) => {
      const tooltipText = d.data.name;
      tooltipDiv.transition()
        .duration(200)
        .style('opacity', .9);
      tooltipDiv.html(tooltipText)
        .style('left', `${d3.event.pageX + leftTooltipOffset}px`)
        .style('top', `${d3.event.pageY + topTooltipOffset}px`);
      })
    .on('mouseout', () => {
      tooltipDiv.transition()
        .duration(500)
        .style('opacity', 0);
      const tooltipGraphDiv = document.querySelectorAll('.tooltipGraphDiv');
      const tooltipGraphArr = Array.prototype.slice.call(tooltipGraphDiv);
      tooltipGraphArr.map((tooltipGraph) => tooltipGraph.style.opacity = '0');
    })
    .text((d) => d.data.name.length > 10 ? d.data.name.substring(0, 10) + '...' : d.data.name);
}
IndexController.$inject = [];

angular.module('index')
  .controller('IndexController', IndexController);
