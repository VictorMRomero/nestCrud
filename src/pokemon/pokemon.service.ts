import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';





@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  // ------------------------------------ Crear ----------------------------------------

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try {
      
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;

    } catch (error) {

      this.handleExceptions(error)
    
    }

  }
  

//---------------------- Retornar todos ----------------------------
  findAll() {
    return `This action returns all pokemon`;
  }



//------------------------ Encontrar uno --------------------------
  async findOne(term: string) {
    let pokemon: Pokemon;

    //Por el numero
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({no: term});
    }

    //Mongo Id
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }

    //Nombre
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({name: term.toLocaleLowerCase()})
    }

    if(!pokemon) throw new NotFoundException(`No se encontro ${term}`)

    return pokemon;

  }

  // ----------------------------- Actualizar ---------------------------
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(term);
    
    if(updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase()
    };
    try {

      await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto}
      
    } catch (error) {
      this.handleExceptions(error)
    }
    

  }

  // ------------------------ Elimar ----------------------------------
  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    
    // await pokemon.deleteOne()
  
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id})
    if(deletedCount === 0){
      throw new BadRequestException(`pokemon no existe con ${id}`)
    }
    
  }




  private handleExceptions( error: any) {
    if(error.code === 11000){
      throw new BadRequestException(`El pokemon ya existe ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`No se pudo crear el pokemon ${JSON.stringify(error.keyValue)}`)
  }
}
